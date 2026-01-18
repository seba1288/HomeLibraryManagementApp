
export type RecommendationResult = {
    category: string;
    type: 'author' | 'genre';
    books: any[];
};

export async function getRecommendations(userBooks: any[]): Promise<RecommendationResult[]> {
    if (!userBooks || userBooks.length === 0) {
        return fetchGeneralRecommendations();
    }

    const { topAuthors, topGenres } = analyzeUserLibrary(userBooks);
    const recommendations: RecommendationResult[] = [];

    // Fetch for top authors
    for (const author of topAuthors) {
        const books = await fetchFromGoogleBooks(`inauthor:"${author}"`, userBooks);
        if (books.length > 0) {
            recommendations.push({
                category: `Because you read ${author}`,
                type: 'author',
                books
            });
        }
    }

    // Fetch for top genres
    for (const genre of topGenres) {
        const books = await fetchFromGoogleBooks(`subject:"${genre}"`, userBooks);
        if (books.length > 0) {
            recommendations.push({
                category: `Popular in ${genre}`,
                type: 'genre',
                books
            });
        }
    }
    
    // If we didn't get enough, add some general ones
    if (recommendations.length === 0) {
        return fetchGeneralRecommendations();
    }

    return recommendations;
}

function analyzeUserLibrary(books: any[]) {
    const authorCounts: Record<string, number> = {};
    const genreCounts: Record<string, number> = {};

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

    // To map back to display names
    const authorDisplayNames: Record<string, string> = {};
    const genreDisplayNames: Record<string, string> = {};

    books.forEach(book => {
        // Count authors
        if (book.authors && Array.isArray(book.authors)) {
            book.authors.forEach((a: any) => {
                const name = typeof a === 'string' ? a : a.first_name;
                if (name) {
                    const key = normalize(name);
                    authorCounts[key] = (authorCounts[key] || 0) + 1;
                    if (!authorDisplayNames[key] || name.length > authorDisplayNames[key].length) {
                         authorDisplayNames[key] = name; // Keep the longest/best formatted name
                    }
                }
            });
        }

        // Count genres
        if (book.genres && Array.isArray(book.genres)) {
            book.genres.forEach((g: any) => {
                const name = typeof g === 'string' ? g : g.name;
                if (name) {
                     const key = normalize(name);
                     genreCounts[key] = (genreCounts[key] || 0) + 1;
                     genreDisplayNames[key] = name;
                }
            });
        }
    });

    const topAuthors = Object.entries(authorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(e => authorDisplayNames[e[0]]);

    const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(e => genreDisplayNames[e[0]]);

    return { topAuthors, topGenres };
}

async function fetchFromGoogleBooks(query: string, userBooks: any[]) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=en`);
        if (!response.ok) return [];
        const data = await response.json();
        
        if (!data.items) return [];

        // Map to our book structure (simplified) and filter owned
        return data.items.map((item: any) => {
            const info = item.volumeInfo;
                const isbn = info.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier 
                             || info.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier;

                return {
                    id: item.id, // Google ID
                    title: info.title,
                    authors: info.authors ? info.authors.map((name: string) => ({ first_name: name })) : [],
                    cover_url: info.imageLinks?.thumbnail?.replace('http:', 'https:'),
                    description: info.description,
                    pageCount: info.pageCount,
                    publishedDate: info.publishedDate,
                    averageRating: info.averageRating,
                    isbn,
                    genres: info.categories 
                        ? info.categories.flatMap((c: string) => c.split('/').map(s => s.trim())) 
                        : []
                };
        }).filter((recBook: any) => {
            // Filter out books the user (likely) already owns
            // Check by title fuzzy match
            const isOwned = userBooks.some(owned => 
                owned.title.toLowerCase() === recBook.title.toLowerCase()
            );
            return !isOwned;
        });

    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return [];
    }
}

async function fetchGeneralRecommendations(): Promise<RecommendationResult[]> {
    // Fallback: fetch some generic popular coding or fiction books, or just "books"
    // Let's try "subject:fiction" for a broad default
    const books = await fetchFromGoogleBooks('subject:fiction', []);
    return [{
        category: 'Top Picks',
        type: 'genre', // effectively
        books
    }];
}
