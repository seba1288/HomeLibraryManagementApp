// Main tables
export interface Book {
  book_id: number
  title: string
  year_of_publishing: number | null
  main_character: string | null
  notes: string | null
  cover_url: string | null
  publisher_id: number | null
  series_id: number | null
  category_id: number | null
}

export interface Author {
  author_id: number
  first_name: string
  middle_name: string | null
  last_name: string
  alt: string | null
  monandry: string | null
  title: string | null
}

export interface Publisher {
  publisher_id: number
  name: string
}

export interface Series {
  series_id: number
  name: string
}

export interface Category {
  category_id: number
  name: string
}

export interface Genre {
  genre_id: number
  name: string
}

export interface Topic {
  topic_id: number
  name: string
}

export interface User {
  user_id: number
  username: string
  email: string
  password_hash: string
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

export interface SeriesAuthor {
  series_id: number
  author_id: number
}

export interface UserLibrary {
  entry_id: number
  user_id: number
  book_id: number
  status: string
  personal_notes: string | null
  date_added: string | null
}

// Form data types (for inserts - without auto-generated IDs)
export interface BookFormData {
  title: string
  year_of_publishing: number | null
  main_character: string | null
  notes: string | null
  cover_url: string | null
  publisher_id: number | null
  series_id: number | null
  category_id: number | null
}
