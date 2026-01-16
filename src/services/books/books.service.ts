import { supabase } from '../supabase'

type BookInput = {
  title: string
  authors?: string[]
  genres?: string[]
  year_of_publishing?: number | null
  isbn?: string | null
  pages?: number | null
  notes?: string | null
  cover_url?: string | null
  publisher_id?: number | null
  series_id?: number | null
  category_id?: number | null
}

type BookRecord = any

function normalizeName(s: string) {
  return s.trim()
}

async function findOrCreateAuthor(name: string) {
  const norm = normalizeName(name)
  // try to find by first_name (case-insensitive)
  let { data, error } = await supabase
    .from('authors')
    .select('author_id, first_name')
    .ilike('first_name', norm)
    .limit(1)

  if (error) {
    // continue to attempt insert
    data = null
  }

  if (data && data.length > 0) return data[0].author_id

  const insertResp = await supabase.from('authors').insert({ first_name: norm }).select('author_id').limit(1)
  if (insertResp.error) throw insertResp.error
  return insertResp.data?.[0]?.author_id
}

async function findOrCreateGenre(name: string) {
  const norm = normalizeName(name)
  let { data, error } = await supabase.from('genres').select('genre_id, name').ilike('name', norm).limit(1)
  if (error) data = null
  if (data && data.length > 0) return data[0].genre_id
  const insertResp = await supabase.from('genres').insert({ name: norm }).select('genre_id').limit(1)
  if (insertResp.error) throw insertResp.error
  return insertResp.data?.[0]?.genre_id
}

async function tryInsertBook(payload: Record<string, any>) {
  // Try inserting the payload as-is. If unknown-column errors occur (e.g., isbn/pages not present),
  // strip those fields and retry.
  const attempt = await supabase.from('books').insert(payload).select().maybeSingle()
  if (!attempt.error) return attempt

  const msg = attempt.error.message || ''
  // detect unknown column or column does not exist
  if (msg.toLowerCase().includes('column') || msg.toLowerCase().includes('does not exist')) {
    const cleaned = { ...payload }
    delete cleaned.isbn
    delete cleaned.pages
    const retry = await supabase.from('books').insert(cleaned).select().maybeSingle()
    return retry
  }

  return attempt
}

export async function fetchIsbnFromOpenLibrary(title: string, authors?: string[]) {
  if (!title) return null
  const params = new URLSearchParams()
  params.set('title', title)
  if (authors && authors.length) params.set('author', authors[0])
  params.set('limit', '5')

  const url = `https://openlibrary.org/search.json?${params.toString()}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const json = await res.json()
    const docs = json.docs || []
    if (!docs.length) return null

    // prefer ISBN_13 values if present
    for (const doc of docs) {
      const isbns: string[] = doc.isbn || []
      if (!isbns || !isbns.length) continue
      // pick the first ISBN-13 if available
      const isbn13 = isbns.find((i: string) => i.length === 13)
      if (isbn13) return isbn13
      // fallback to first isbn
      return isbns[0]
    }
    return null
  } catch (err) {
    return null
  }
}

export async function createBook(input: BookInput) {
  if (!input.title) throw new Error('Title is required')

  const payload: Record<string, any> = {
    title: input.title,
    year_of_publishing: input.year_of_publishing ?? null,
    notes: input.notes ?? null,
    cover_url: input.cover_url ?? null,
    publisher_id: input.publisher_id ?? null,
    series_id: input.series_id ?? null,
    category_id: input.category_id ?? null,
  }

  if (input.isbn) payload.isbn = input.isbn
  if (input.pages) payload.pages = input.pages

  const inserted = await tryInsertBook(payload)
  if (inserted.error) throw inserted.error
  const book: BookRecord = inserted.data
  const bookId = book.book_id || book.id || book.bookId

  // authors
  if (input.authors && input.authors.length) {
    for (const a of input.authors) {
      const authorId = await findOrCreateAuthor(a)
      if (!authorId) continue
      // attempt to insert link; ignore conflicts
      await supabase.from('book_authors').insert({ book_id: bookId, author_id: authorId }).match(() => null)
    }
  }

  // genres
  if (input.genres && input.genres.length) {
    for (const g of input.genres) {
      const genreId = await findOrCreateGenre(g)
      if (!genreId) continue
      await supabase.from('book_genres').insert({ book_id: bookId, genre_id: genreId }).match(() => null)
    }
  }

  return getBookById(bookId)
}

export async function updateBook(bookId: number, input: Partial<BookInput>) {
  if (!bookId) throw new Error('bookId required')

  const payload: Record<string, any> = {}
  if (input.title !== undefined) payload.title = input.title
  if (input.year_of_publishing !== undefined) payload.year_of_publishing = input.year_of_publishing
  if (input.notes !== undefined) payload.notes = input.notes
  if (input.cover_url !== undefined) payload.cover_url = input.cover_url
  if (input.publisher_id !== undefined) payload.publisher_id = input.publisher_id
  if (input.series_id !== undefined) payload.series_id = input.series_id
  if (input.category_id !== undefined) payload.category_id = input.category_id
  if (input.isbn !== undefined) payload.isbn = input.isbn
  if (input.pages !== undefined) payload.pages = input.pages

  if (Object.keys(payload).length) {
    const { error } = await supabase.from('books').update(payload).eq('book_id', bookId)
    if (error && !(error.message || '').toLowerCase().includes('column')) throw error
  }

  // sync authors
  if (input.authors) {
    const desired = [] as number[]
    for (const a of input.authors) {
      const authorId = await findOrCreateAuthor(a)
      if (authorId) desired.push(authorId)
    }
    const { data: existingLinks } = await supabase.from('book_authors').select('author_id').eq('book_id', bookId)
    const existing = (existingLinks || []).map((r: any) => r.author_id)
    const toAdd = desired.filter((id) => !existing.includes(id))
    const toRemove = existing.filter((id) => !desired.includes(id))
    if (toAdd.length) {
      for (const id of toAdd) await supabase.from('book_authors').insert({ book_id: bookId, author_id: id }).match(() => null)
    }
    if (toRemove.length) {
      for (const id of toRemove) await supabase.from('book_authors').delete().match({ book_id: bookId, author_id: id }).match(() => null)
    }
  }

  // sync genres
  if (input.genres) {
    const desired = [] as number[]
    for (const g of input.genres) {
      const genreId = await findOrCreateGenre(g)
      if (genreId) desired.push(genreId)
    }
    const { data: existingLinks } = await supabase.from('book_genres').select('genre_id').eq('book_id', bookId)
    const existing = (existingLinks || []).map((r: any) => r.genre_id)
    const toAdd = desired.filter((id) => !existing.includes(id))
    const toRemove = existing.filter((id) => !desired.includes(id))
    if (toAdd.length) {
      for (const id of toAdd) await supabase.from('book_genres').insert({ book_id: bookId, genre_id: id }).match(() => null)
    }
    if (toRemove.length) {
      for (const id of toRemove) await supabase.from('book_genres').delete().match({ book_id: bookId, genre_id: id }).match(() => null)
    }
  }

  return getBookById(bookId)
}

export async function deleteBook(bookId: number) {
  if (!bookId) throw new Error('bookId required')
  await supabase.from('book_authors').delete().eq('book_id', bookId).match(() => null)
  await supabase.from('book_genres').delete().eq('book_id', bookId).match(() => null)
  const { data, error } = await supabase.from('books').delete().eq('book_id', bookId).select().maybeSingle()
  if (error) throw error
  return data
}

export async function getBooks(opts?: { search?: string; genre?: string; author?: string; year?: number; limit?: number; offset?: number }) {
  const limit = opts?.limit ?? 100
  let { data: books, error } = await supabase.from('books').select('*').limit(limit).order('title', { ascending: true })
  if (error) throw error
  if (!books || !books.length) return []
  const ids = books.map((b: any) => b.book_id)

  const { data: ba } = await supabase.from('book_authors').select('book_id, author_id').in('book_id', ids)
  const authorIds = (ba || []).map((r: any) => r.author_id)
  const { data: authors } = await supabase.from('authors').select('*').in('author_id', authorIds)

  const { data: bg } = await supabase.from('book_genres').select('book_id, genre_id').in('book_id', ids)
  const genreIds = (bg || []).map((r: any) => r.genre_id)
  const { data: genres } = await supabase.from('genres').select('*').in('genre_id', genreIds)

  const authorsByBook: Record<number, any[]> = {}
  for (const link of (ba || [])) {
    const a = (authors || []).find((x: any) => x.author_id === link.author_id)
    if (!a) continue
    authorsByBook[link.book_id] = authorsByBook[link.book_id] || []
    authorsByBook[link.book_id].push(a)
  }

  const genresByBook: Record<number, any[]> = {}
  for (const link of (bg || [])) {
    const g = (genres || []).find((x: any) => x.genre_id === link.genre_id)
    if (!g) continue
    genresByBook[link.book_id] = genresByBook[link.book_id] || []
    genresByBook[link.book_id].push(g)
  }

  const combined = books.map((b: any) => ({ ...b, authors: authorsByBook[b.book_id] || [], genres: genresByBook[b.book_id] || [] }))

  // basic filtering client-side (search, author, genre, year) if opts provided
  let filtered = combined
  if (opts?.search) {
    const q = opts.search.toLowerCase()
    filtered = filtered.filter((b: any) => (b.title || '').toLowerCase().includes(q))
  }
  if (opts?.author) {
    const q = opts.author.toLowerCase()
    filtered = filtered.filter((b: any) => (b.authors || []).some((a: any) => (a.first_name || '').toLowerCase().includes(q)))
  }
  if (opts?.genre) {
    const q = opts.genre.toLowerCase()
    filtered = filtered.filter((b: any) => (b.genres || []).some((g: any) => (g.name || '').toLowerCase().includes(q)))
  }
  if (opts?.year) filtered = filtered.filter((b: any) => b.year_of_publishing === opts.year)

  return filtered
}

export async function getBookById(bookId: number) {
  const { data: bookArr, error } = await supabase.from('books').select('*').eq('book_id', bookId).limit(1)
  if (error) throw error
  const book = (bookArr || [])[0]
  if (!book) return null

  const { data: ba } = await supabase.from('book_authors').select('author_id').eq('book_id', bookId)
  const authorIds = (ba || []).map((r: any) => r.author_id)
  const { data: authors } = await supabase.from('authors').select('*').in('author_id', authorIds)

  const { data: bg } = await supabase.from('book_genres').select('genre_id').eq('book_id', bookId)
  const genreIds = (bg || []).map((r: any) => r.genre_id)
  const { data: genres } = await supabase.from('genres').select('*').in('genre_id', genreIds)

  return { ...book, authors: authors || [], genres: genres || [] }
}

export default {
  createBook,
  updateBook,
  deleteBook,
  getBooks,
  getBookById,
  fetchIsbnFromOpenLibrary,
}
