// Main tables
export interface Book {
  id: number
  title: string
  year_of_publishing: number | null
  isbn: string | null
  pages_count: number | null
  reading_status: 'UNREAD' | 'READING' | 'COMPLETED'
  publisher_id: number | null
  series_id: number | null
  cover_url: string
  notes: string
}

export interface Author {
  id: number
  first_name: string
  middle_name: string | null
  last_name: string
  alias: string | null
  monastery: string | null
  title: string | null
}

export interface Publisher {
  id: number
  name: string
}

export interface Series {
  id: number
  name: string
}

export interface Category {
  id: number
  name: string
}

export interface Genre {
  id: number
  name: string
}

export interface Topic {
  id: number
  name: string
}

export interface Note {
  id: number
  description: string
  book_id: number
}

// Junction tables
export interface BookAuthor {
  book_id: number
  author_id: number
}

export interface BookGenre {
  book_id: number
  genre_id: number
}

export interface BookTopic {
  book_id: number
  topic_id: number
}

export interface BookSeries {
  book_id: number
  series_id: number
}

export interface SeriesAuthor {
  series_id: number
  author_id: number
}

// Extended types with relations
export interface BookWithRelations extends Book {
  authors?: Author[]
  genres?: Genre[]
  topics?: Topic[]
  publisher?: Publisher | null
  series?: Series | null
  category?: Category | null
}

// Form data types (for inserts - without auto-generated IDs)
export interface BookFormData {
  title: string
  year_of_publishing?: number | null
  isbn?: string | null
  pages_count?: number | null
  reading_status?: 'UNREAD' | 'READING' | 'COMPLETED'
  publisher_id?: number | null
  series_id?: number | null
  cover_url?: string
  notes?: string
  authors?: string[]
  genres?: string[]
}
