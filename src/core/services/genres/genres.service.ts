import { supabase } from '../supabase'

export async function getAllGenres() {
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createGenre(name: string) {
  const { data, error } = await supabase
    .from('genres')
    .insert({ name: name.trim() })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function findOrCreateGenre(name: string) {
  const norm = name.trim()
  let { data, error } = await supabase.from('genres').select('id, name').ilike('name', norm).limit(1)
  if (error) data = null
  if (data && data.length > 0) return data[0].id
  const insertResp = await supabase.from('genres').insert({ name: norm }).select('id').limit(1)
  if (insertResp.error) throw insertResp.error
  return insertResp.data?.[0]?.id
}

export default {
  getAllGenres,
  createGenre,
  findOrCreateGenre,
}
