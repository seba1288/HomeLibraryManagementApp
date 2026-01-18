import { supabase } from '../supabase'

export async function getAllSeries() {
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .order('name', { ascending: true })
  if (error) {
    console.error('Failed to fetch series:', error)
    throw error
  }
  return data || []
}

export async function createSeries(name: string) {
  const { data: existing } = await supabase
    .from('series')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
  
  const nextId = existing && existing.length > 0 ? existing[0].id + 1 : 1
  
  const { data, error } = await supabase
    .from('series')
    .insert({ id: nextId, name: name.trim() })
    .select()
    .single()
  if (error) throw error
  return data
}

export default {
  getAllSeries,
  createSeries,
}
