 import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import type { Publisher, Series, Category, BookFormData } from '../interfaces/types'

function Test() {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    year_of_publishing: null,
    main_character: null,
    notes: null,
    cover_url: null,
    publisher_id: null,
    series_id: null,
    category_id: null
  })
  
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const updateFormData = (field: keyof BookFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Load dropdown data
  useEffect(() => {
    async function loadDropdownData() {
      const [pubRes, serRes, catRes] = await Promise.all([
        supabase.from('publishers').select('*'),
        supabase.from('series').select('*'),
        supabase.from('categories').select('*')
      ])
      
      if (pubRes.data) setPublishers(pubRes.data)
      if (serRes.data) setSeriesList(serRes.data)
      if (catRes.data) setCategories(catRes.data)
    }
    loadDropdownData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const { error } = await supabase
        .from('books')
        .insert([formData])

      if (error) {
        console.error('Error:', error)
        setStatus('error')
        setMessage(`Error: ${error.message}`)
      } else {
        setStatus('success')
        setMessage('Book added successfully!')
        // Clear form
        setFormData({
          title: '',
          year_of_publishing: null,
          main_character: null,
          notes: null,
          cover_url: null,
          publisher_id: null,
          series_id: null,
          category_id: null
        })
      }
    } catch (err) {
      console.error('Error:', err)
      setStatus('error')
      setMessage('Failed to add book')
    }
  }

  const inputStyle = { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' as const }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add Book to Database</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Title: *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Year of Publishing:</label>
          <input
            type="number"
            value={formData.year_of_publishing ?? ''}
            onChange={(e) => updateFormData('year_of_publishing', e.target.value ? parseInt(e.target.value) : null)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Main Character:</label>
          <input
            type="text"
            value={formData.main_character ?? ''}
            onChange={(e) => updateFormData('main_character', e.target.value || null)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Cover URL:</label>
          <input
            type="url"
            value={formData.cover_url ?? ''}
            onChange={(e) => updateFormData('cover_url', e.target.value || null)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Publisher:</label>
          <select
            value={formData.publisher_id ?? ''}
            onChange={(e) => updateFormData('publisher_id', e.target.value ? Number(e.target.value) : null)}
            style={inputStyle}
          >
            <option value="">-- Select Publisher --</option>
            {publishers.map((p) => (
              <option key={p.publisher_id} value={p.publisher_id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Series:</label>
          <select
            value={formData.series_id ?? ''}
            onChange={(e) => updateFormData('series_id', e.target.value ? Number(e.target.value) : null)}
            style={inputStyle}
          >
            <option value="">-- Select Series --</option>
            {seriesList.map((s) => (
              <option key={s.series_id} value={s.series_id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Category:</label>
          <select
            value={formData.category_id ?? ''}
            onChange={(e) => updateFormData('category_id', e.target.value ? Number(e.target.value) : null)}
            style={inputStyle}
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Notes:</label>
          <textarea
            value={formData.notes ?? ''}
            onChange={(e) => updateFormData('notes', e.target.value || null)}
            rows={4}
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer'
          }}
        >
          {status === 'loading' ? 'Adding...' : 'Add Book'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          borderRadius: '4px',
          backgroundColor: status === 'success' ? '#d4edda' : '#f8d7da',
          color: status === 'success' ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}

export default Test
