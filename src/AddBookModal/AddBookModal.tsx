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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.AddBookIcon}>
                <path d="M12.6667 2.5C13.1063 2.50626 13.5256 2.68598 13.8333 3L17 6.16667C17.314 6.47438 17.4937 6.89372 17.5 7.33333V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H12.6667Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.1668 17.5V11.6667C14.1668 11.4457 14.079 11.2337 13.9228 11.0775C13.7665 10.9212 13.5545 10.8334 13.3335 10.8334H6.66683C6.44582 10.8334 6.23385 10.9212 6.07757 11.0775C5.92129 11.2337 5.8335 11.4457 5.8335 11.6667V17.5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.8335 2.5V5.83333C5.8335 6.05435 5.92129 6.26631 6.07757 6.42259C6.23385 6.57887 6.44582 6.66667 6.66683 6.66667H12.5002" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
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
