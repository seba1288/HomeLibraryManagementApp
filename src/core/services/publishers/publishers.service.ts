import { supabase } from '../supabase'

export async function getAllPublishers() {
  const { data, error } = await supabase
    .from('publishers')
    .select('*')
    .order('name', { ascending: true })
  if (error) {
    console.error('Failed to fetch publishers:', error)
    throw error
  }
  return data || []
}

export async function createPublisher(name: string) {
  const { data, error } = await supabase
    .from('publishers')
    .insert({ name: name.trim() })
    .select()
    .single()
  if (error) throw error
  return data
}

export default {
  getAllPublishers,
  createPublisher,
}
