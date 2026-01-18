import { supabase } from '../supabase'

// Parse a full name string into first, middle, last name parts
export function parseAuthorName(fullName: string): { first_name: string; middle_name: string | null; last_name: string | null } {
  const trimmed = fullName.trim()
  const parts = trimmed.split(/\s+/)
  
  if (parts.length === 1) {
    return { first_name: parts[0], middle_name: null, last_name: null }
  } else if (parts.length === 2) {
    return { first_name: parts[0], middle_name: null, last_name: parts[1] }
  } else {
    // 3+ parts: first is first_name, last is last_name, middle is everything in between
    const first = parts[0]
    const last = parts[parts.length - 1]
    const middle = parts.slice(1, -1).join(' ')
    return { first_name: first, middle_name: middle || null, last_name: last }
  }
}

// Get full display name from author object
export function getAuthorFullName(author: { first_name?: string | null; middle_name?: string | null; last_name?: string | null; title?: string | null; alias?: string | null }): string {
  const parts: string[] = []
  if (author.title) parts.push(author.title)
  if (author.first_name) parts.push(author.first_name)
  if (author.middle_name) parts.push(author.middle_name)
  if (author.last_name) parts.push(author.last_name)
  if (author.alias) parts.push(`(${author.alias})`)
  return parts.join(' ') || 'Unknown'
}

export async function getAllAuthors() {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('first_name', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createAuthor(author: {
  first_name: string
  middle_name?: string | null
  last_name?: string | null
  alias?: string | null
  monastery?: string | null
  title?: string | null
}) {
  const { data, error } = await supabase
    .from('authors')
    .insert({
      first_name: author.first_name,
      middle_name: author.middle_name || null,
      last_name: author.last_name || '',
      alias: author.alias || null,
      monastery: author.monastery || null,
      title: author.title || null,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function findOrCreateAuthor(fullName: string) {
  const norm = fullName.trim()
  const nameParts = parseAuthorName(norm)
  
  // Try to find by matching name or alias (case-insensitive)
  let { data, error } = await supabase
    .from('authors')
    .select('id, first_name, middle_name, last_name, alias')
  
  if (error) {
    data = null
  }

  // Find match on full name components OR alias
  if (data && data.length > 0) {
    const searchNorm = norm.toLowerCase()
    
    // First check if the search term matches an alias exactly
    const aliasMatch = data.find(a => 
      a.alias && a.alias.toLowerCase() === searchNorm
    )
    if (aliasMatch) return aliasMatch.id
    
    // Then check for exact match on full name components
    const match = data.find(a => {
      const firstName = (a.first_name || '').toLowerCase()
      const middleName = (a.middle_name || '').toLowerCase()
      const lastName = (a.last_name || '').toLowerCase()
      
      const searchFirst = (nameParts.first_name || '').toLowerCase()
      const searchMiddle = (nameParts.middle_name || '').toLowerCase()
      const searchLast = (nameParts.last_name || '').toLowerCase()
      
      return firstName === searchFirst && 
             middleName === searchMiddle && 
             lastName === searchLast
    })
    if (match) return match.id
  }

  // Create new author with parsed name parts
  const insertResp = await supabase.from('authors').insert({ 
    first_name: nameParts.first_name, 
    middle_name: nameParts.middle_name || null,
    last_name: nameParts.last_name || '' 
  }).select('id').limit(1)
  if (insertResp.error) throw insertResp.error
  return insertResp.data?.[0]?.id
}

export default {
  getAllAuthors,
  createAuthor,
  findOrCreateAuthor,
  parseAuthorName,
  getAuthorFullName,
}
