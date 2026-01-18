import { supabase } from './supabase'
import booksService from './books/books.service'

type LibraryEntry = {
  entry_id?: number
  user_id: number
  book_id: number
  status?: string
  personal_notes?: string | null
  date_added?: string
}

export async function addToLibrary(userId: number, bookId: number, status = 'Unread', personal_notes: string | null = null) {
  if (!userId || !bookId) throw new Error('userId and bookId required')
  const { data, error } = await supabase
    .from('user_library')
    .insert({ user_id: userId, book_id: bookId, status, personal_notes })
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function updateLibraryEntry(entryId: number, fields: Partial<LibraryEntry>) {
  if (!entryId) throw new Error('entryId required')
  const payload: Record<string, any> = {}
  if (fields.status !== undefined) payload.status = fields.status
  if (fields.personal_notes !== undefined) payload.personal_notes = fields.personal_notes
  if (!Object.keys(payload).length) return getLibraryEntry(entryId)
  const { data, error } = await supabase.from('user_library').update(payload).eq('entry_id', entryId).select().maybeSingle()
  if (error) throw error
  return data
}

export async function removeFromLibrary(entryId: number) {
  if (!entryId) throw new Error('entryId required')
  const { data, error } = await supabase.from('user_library').delete().eq('entry_id', entryId).select().maybeSingle()
  if (error) throw error
  return data
}

export async function getLibraryEntry(entryId: number) {
  const { data, error } = await supabase.from('user_library').select('*').eq('entry_id', entryId).limit(1)
  if (error) throw error
  return (data || [])[0] || null
}

export async function getUserLibrary(userId: number) {
  if (!userId) throw new Error('userId required')
  const { data, error } = await supabase.from('user_library').select('*').eq('user_id', userId).order('date_added', { ascending: false })
  if (error) throw error
  const entries = data || []
  // hydrate book info
  const hydrated = [] as any[]
  for (const e of entries) {
    const book = await booksService.getBookById(e.book_id)
    hydrated.push({ ...e, book })
  }
  return hydrated
}

export async function getLibraryOverview(userId: number) {
  if (!userId) throw new Error('userId required')
  const { data, error } = await supabase.from('user_library').select('status, count', { count: 'exact' }).eq('user_id', userId)
  // If selecting status with counts in a single query is not supported by client, do manual counts
  if (error) {
    // fallback: fetch all and compute
    const { data: all } = await supabase.from('user_library').select('*').eq('user_id', userId)
    const counts: Record<string, number> = {}
    for (const r of (all || [])) counts[r.status] = (counts[r.status] || 0) + 1
    const total = (all || []).length
    return { total, counts }
  }
  // The earlier select likely won't return aggregated counts; compute manually
  const { data: all } = await supabase.from('user_library').select('*').eq('user_id', userId)
  const counts: Record<string, number> = {}
  for (const r of (all || [])) counts[r.status] = (counts[r.status] || 0) + 1
  const total = (all || []).length
  return { total, counts }
}

export async function recommendBooks(userId: number, limit = 10) {
  if (!userId) throw new Error('userId required')
  // 1) get user's library book ids
  const { data: entries } = await supabase.from('user_library').select('book_id').eq('user_id', userId)
  const userBookIds = (entries || []).map((r: any) => r.book_id)

  // 2) get genres for user's books
  if (!userBookIds.length) {
    // fallback: return recent books
    const { data: recent } = await supabase.from('books').select('*').order('book_id', { ascending: false }).limit(limit)
    return recent || []
  }

  const { data: userBg } = await supabase.from('book_genres').select('genre_id, book_id').in('book_id', userBookIds)
  const genreCounts: Record<number, number> = {}
  for (const r of (userBg || [])) genreCounts[r.genre_id] = (genreCounts[r.genre_id] || 0) + 1

  const topGenreIds = Object.entries(genreCounts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3).map((x) => Number(x[0]))
  if (!topGenreIds.length) {
    const { data: recent } = await supabase.from('books').select('*').order('book_id', { ascending: false }).limit(limit)
    return recent || []
  }

  // 3) fetch books in those genres excluding user's books
  const { data: bgLinks } = await supabase.from('book_genres').select('book_id').in('genre_id', topGenreIds)
  const candidateIds = Array.from(new Set((bgLinks || []).map((r: any) => r.book_id))).filter((id) => !userBookIds.includes(id))
  if (!candidateIds.length) return []

  const { data: candidates } = await supabase.from('books').select('*').in('book_id', candidateIds).limit(limit)
  return candidates || []
}

export default {
  addToLibrary,
  updateLibraryEntry,
  removeFromLibrary,
  getLibraryEntry,
  getUserLibrary,
  getLibraryOverview,
  recommendBooks,
}
