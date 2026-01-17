import styles from './AddBookModal.module.css';
import { useState } from 'react';
import { createBook } from '../services/books/books.service';

type AddBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: () => void;
};

function AddBookModal({ isOpen, onClose, onBookAdded }: AddBookModalProps) {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [genres, setGenres] = useState('');
  const [year, setYear] = useState('');
  const [isbn, setIsbn] = useState('');
  const [pages, setPages] = useState('');
  const [notes, setNotes] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createBook({
        title,
        authors: authors ? authors.split(',').map(a => a.trim()).filter(Boolean) : [],
        genres: genres ? genres.split(',').map(g => g.trim()).filter(Boolean) : [],
        year_of_publishing: year ? Number(year) : null,
        isbn: isbn || null,
        pages: pages ? Number(pages) : null,
        notes: notes || null,
        cover_url: coverUrl || null,
      });
      setLoading(false);
      onClose();
      onBookAdded();
      setTitle(''); setAuthors(''); setGenres(''); setYear(''); setIsbn(''); setPages(''); setNotes(''); setCoverUrl('');
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Failed to add book');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add a New Book</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Title*
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </label>
            <label>
              Authors (comma separated)
              <input type="text" value={authors} onChange={e => setAuthors(e.target.value)} />
            </label>
            <label>
              Genres (comma separated)
              <input type="text" value={genres} onChange={e => setGenres(e.target.value)} />
            </label>
            <label>
              Year of Publishing
              <input type="number" value={year} onChange={e => setYear(e.target.value)} />
            </label>
            <label>
              ISBN
              <input type="text" value={isbn} onChange={e => setIsbn(e.target.value)} />
            </label>
            <label>
              Pages
              <input type="number" value={pages} onChange={e => setPages(e.target.value)} />
            </label>
            <label>
              Notes
              <textarea value={notes} onChange={e => setNotes(e.target.value)} />
            </label>
            <label>
              Cover URL
              <input type="text" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Book'}
            </button>
            {error && <div style={{color: 'red', marginTop: '8px'}}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBookModal;
