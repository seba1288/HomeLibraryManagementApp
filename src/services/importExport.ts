import { supabase } from './supabase'
import booksService from './books/books.service'
import { addToLibrary } from './library'

type ImportResult = {
  createdBooks: number
  linkedEntries: number
  errors: Array<{ row: number; error: string }>
}

function escapeCSV(value: any) {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

function parseCSV(csv: string) {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (!lines.length) return { headers: [], rows: [] }
  const headers = parseCSVLine(lines[0])
  const rows = lines.slice(1).map((l) => parseCSVLine(l))
  return { headers, rows }
}

function parseCSVLine(line: string) {
  const result: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += ch
      }
    } else {
      if (ch === ',') {
        result.push(cur)
        cur = ''
      } else if (ch === '"') {
        inQuotes = true
      } else {
        cur += ch
      }
    }
  }
  result.push(cur)
  return result
}

export async function exportLibrary(userId: number, format: 'json' | 'csv' = 'json') {
  if (!userId) throw new Error('userId required')
  const { data: entries } = await supabase.from('user_library').select('*').eq('user_id', userId).order('date_added', { ascending: false })
  const list = (entries || []) as any[]
  // hydrate books
  const hydrated: any[] = []
  for (const e of list) {
    const book = await booksService.getBookById(e.book_id)
    hydrated.push({ entry: e, book })
  }

  if (format === 'json') return JSON.stringify(hydrated, null, 2)

  // CSV
  const headers = [
    'book_id',
    'title',
    'authors',
    'genres',
    'year_of_publishing',
    'isbn',
    'pages',
    'status',
    'personal_notes',
    'date_added',
  ]
  const lines = [headers.join(',')]
  for (const row of hydrated) {
    const b = row.book || {}
    const e = row.entry || {}
    const authors = (b.authors || []).map((a: any) => a.first_name || '').join(';')
    const genres = (b.genres || []).map((g: any) => g.name || '').join(';')
    const line = [
      escapeCSV(b.book_id ?? ''),
      escapeCSV(b.title ?? ''),
      escapeCSV(authors),
      escapeCSV(genres),
      escapeCSV(b.year_of_publishing ?? ''),
      escapeCSV((b as any).isbn ?? ''),
      escapeCSV((b as any).pages ?? ''),
      escapeCSV(e.status ?? ''),
      escapeCSV(e.personal_notes ?? ''),
      escapeCSV(e.date_added ?? ''),
    ]
    lines.push(line.join(','))
  }
  return lines.join('\n')
}

async function findBookByIsbn(isbn?: string | null) {
  if (!isbn) return null
  try {
    const { data } = await supabase.from('books').select('*').eq('isbn', isbn).limit(1)
    if (data && data.length) return data[0]
  } catch (err) {
    // isbn column may not exist; ignore
    return null
  }
  return null
}

export async function importLibraryFromJSON(userId: number, jsonText: string) {
  if (!userId) throw new Error('userId required')
  let parsed: any
  try {
    parsed = JSON.parse(jsonText)
  } catch (err: any) {
    throw new Error('Invalid JSON')
  }
  if (!Array.isArray(parsed)) parsed = parsed
  const result: ImportResult = { createdBooks: 0, linkedEntries: 0, errors: [] }
  let row = 0
  for (const item of parsed) {
    row++
    try {
      const bookData = item.book || item
      // try match by ISBN
      let existing = null
      if (bookData.isbn) existing = await findBookByIsbn(bookData.isbn)
      let bookId: number | null = existing?.book_id ?? null
      if (!bookId) {
        const toCreate: any = {
          title: bookData.title || 'Untitled',
          authors: (bookData.authors || []).map((a: any) => (typeof a === 'string' ? a : a.first_name || '')),
          genres: (bookData.genres || []).map((g: any) => (typeof g === 'string' ? g : g.name || '')),
          year_of_publishing: bookData.year_of_publishing || null,
          isbn: bookData.isbn || null,
          pages: (bookData.pages !== undefined ? Number(bookData.pages) : null),
          notes: bookData.notes || null,
        }
        const created = await booksService.createBook(toCreate)
        bookId = created?.book_id
        result.createdBooks++
      }
      // link to library
      await addToLibrary(userId, bookId as number, item.entry?.status || item.status || 'Unread', item.entry?.personal_notes || item.personal_notes || null)
      result.linkedEntries++
    } catch (err: any) {
      result.errors.push({ row, error: err.message || String(err) })
    }
  }
  return result
}

export async function importLibraryFromCSV(userId: number, csvText: string) {
  if (!userId) throw new Error('userId required')
  const { headers, rows } = parseCSV(csvText)
  const result: ImportResult = { createdBooks: 0, linkedEntries: 0, errors: [] }
  let rn = 0
  for (const r of rows) {
    rn++
    try {
      const obj: any = {}
      for (let i = 0; i < headers.length; i++) obj[headers[i]] = r[i] ?? ''

      const authors = (obj.authors || '').split(';').map((s: string) => s.trim()).filter(Boolean)
      const genres = (obj.genres || '').split(';').map((s: string) => s.trim()).filter(Boolean)

      let existing = null
      if (obj.isbn) existing = await findBookByIsbn(obj.isbn)
      let bookId: number | null = existing?.book_id ?? null
      if (!bookId) {
        const toCreate: any = {
          title: obj.title || 'Untitled',
          authors,
          genres,
          year_of_publishing: obj.year_of_publishing ? Number(obj.year_of_publishing) : null,
          isbn: obj.isbn || null,
          pages: obj.pages ? Number(obj.pages) : null,
          notes: obj.personal_notes || null,
        }
        const created = await booksService.createBook(toCreate)
        bookId = created?.book_id
        result.createdBooks++
      }

      await addToLibrary(userId, bookId as number, obj.status || 'Unread', obj.personal_notes || null)
      result.linkedEntries++
    } catch (err: any) {
      result.errors.push({ row: rn, error: err.message || String(err) })
    }
  }
  return result
}

export default { exportLibrary, importLibraryFromJSON, importLibraryFromCSV }
