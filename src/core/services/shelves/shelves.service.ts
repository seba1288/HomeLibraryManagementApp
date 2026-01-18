import { supabase } from '../supabase';

export type Shelf = {
    id: number;
    name: string;
    created_at: string;
    book_count?: number; // Optional count for display
};

export type ShelfBook = {
    shelf_id: number;
    book_id: number;
    added_at: string;
};

export async function getShelves() {
    // Fetch shelves and joined count of books
    // Supabase doesn't support count on foreign key in a single simple select easily without rpc or explicit join count
    // For now, we'll just fetch shelves and maybe count client side or separate query if needed. 
    // Let's try to get shelves first.
    const { data, error } = await supabase
        .from('shelves')
        .select('*')
        .order('name', { ascending: true });
        
    if (error) throw error;
    
    // To get counts, we might want to do a separate query or use a view, but for simplicity let's just fetch them.
    // If the list is huge this is bad, but for a personal library it's fine.
    // Actually, let's just select id from shelf_books to count.
    
    const shelves = data as Shelf[];
    const shelvesWithCount = await Promise.all(shelves.map(async (shelf) => {
        const { count } = await supabase
            .from('shelf_books')
            .select('*', { count: 'exact', head: true })
            .eq('shelf_id', shelf.id);
        return { ...shelf, book_count: count || 0 };
    }));

    return shelvesWithCount;
}

export async function createShelf(name: string) {
    const { data, error } = await supabase
        .from('shelves')
        .insert({ name })
        .select()
        .single();
    if (error) throw error;
    return data as Shelf;
}

export async function deleteShelf(id: number) {
    const { error } = await supabase
        .from('shelves')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

export async function addBookToShelf(shelfId: number, bookId: number) {
    const { error } = await supabase
        .from('shelf_books')
        .insert({ shelf_id: shelfId, book_id: bookId });
    // Ignore duplicate key error if already exists?
    if (error && error.code !== '23505') throw error; // 23505 is unique_violation
}

export async function removeBookFromShelf(shelfId: number, bookId: number) {
    const { error } = await supabase
        .from('shelf_books')
        .delete()
        .match({ shelf_id: shelfId, book_id: bookId });
    if (error) throw error;
}

export async function getShelfBooks(shelfId: number) {
    const { data, error } = await supabase
        .from('shelf_books')
        .select('book_id')
        .eq('shelf_id', shelfId);
    
    if (error) throw error;
    
    const bookIds = data.map(r => r.book_id);
    if (bookIds.length === 0) return [];
    
    // Fetch full book details for each ID. 
    // Ideally we would do a join in `getBooks` or similar, but reuse existing service for consistency.
    // Assuming getBookById is efficient enough or we can use `in` query if we export a bulk fetcher.
    // Let's use `getBooks` service logic but modified for specific IDs if possible, 
    // OR just fetch from 'books' table directly here to be faster.
    
    // We already have logic in books.service.ts to fetch authors/genres. 
    // Let's try to reuse `getBooks` if we can import logic, but `getBooks` doesn't filter by IDs list easily.
    // Let's just implement a simple fetch here with joins, similar to `getBooks`.
    
    // NOTE: This duplicates some logic from books.service.ts but ensures we get the exact view we want.
    const { data: books, error: booksError } = await supabase
        .from('books')
        .select('*')
        .in('id', bookIds)
        .order('title');
        
    if (booksError) throw booksError;
    
    // We need to attach authors/genres manually like in books.service.ts
    // or we can rely on `getBooks` if we could filter by IDs.
    // Let's copy the hydration logic which is safer for consistency.
    
    const ids = books.map(b => b.id);
    
     const { data: ba } = await supabase.from('book_authors').select('book_id, author_id').in('book_id', ids);
    const authorIds = (ba || []).map((r: any) => r.author_id);
    const { data: authors } = await supabase.from('authors').select('*').in('id', authorIds);

    const { data: bg } = await supabase.from('book_genres').select('book_id, genre_id').in('book_id', ids);
    const genreIds = (bg || []).map((r: any) => r.genre_id);
    const { data: genres } = await supabase.from('genres').select('*').in('id', genreIds);

    const authorsByBook: Record<number, any[]> = {};
    for (const link of (ba || [])) {
        const a = (authors || []).find((x: any) => x.id === link.author_id);
        if (!a) continue;
        authorsByBook[link.book_id] = authorsByBook[link.book_id] || [];
        authorsByBook[link.book_id].push(a);
    }

    const genresByBook: Record<number, any[]> = {};
    for (const link of (bg || [])) {
        const g = (genres || []).find((x: any) => x.id === link.genre_id);
        if (!g) continue;
        genresByBook[link.book_id] = genresByBook[link.book_id] || [];
        genresByBook[link.book_id].push(g);
    }

    return books.map((b: any) => ({
        ...b,
        authors: authorsByBook[b.id] || [],
        genres: genresByBook[b.id] || []
    }));
}
