import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchIsbnFromOpenLibrary } from '../services/books/books.service'

const originalFetch = global.fetch

describe('fetchIsbnFromOpenLibrary', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('returns null when title is empty', async () => {
    const res = await fetchIsbnFromOpenLibrary('')
    expect(res).toBeNull()
  })

  it('parses ISBN-13 from Open Library response', async () => {
    const mockJson = {
      docs: [
        { title: 'Test Book', isbn: ['9781234567897', '1234567890'] },
      ],
    }

    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockJson) })) as any

    const res = await fetchIsbnFromOpenLibrary('Test Book', ['Some Author'])
    expect(res).toBe('9781234567897')
  })

  it('falls back to first isbn when no ISBN-13 present', async () => {
    const mockJson = { docs: [{ title: 'Old Book', isbn: ['1234567890'] }] }
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockJson) })) as any
    const res = await fetchIsbnFromOpenLibrary('Old Book')
    expect(res).toBe('1234567890')
  })

  it('returns null on non-ok response', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false })) as any
    const res = await fetchIsbnFromOpenLibrary('Nope')
    expect(res).toBeNull()
  })

  it('returns null on fetch error', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('network'))) as any
    const res = await fetchIsbnFromOpenLibrary('Error Book')
    expect(res).toBeNull()
  })
})
