import styles from './EditBookModal.module.css';
import { useState, useEffect } from 'react';
import { updateBook } from '../../services/books/books.service';

type EditBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  book: any;
  onBookUpdated: () => void;
};

function EditBookModal({ isOpen, onClose, book, onBookUpdated }: EditBookModalProps) {
  const [title, setTitle] = useState(book?.title || '');
  const [authors, setAuthors] = useState(book?.authors ? book.authors.map((a: any) => a.first_name).join(', ') : '');
  const [genres, setGenres] = useState(book?.genres ? book.genres.map((g: any) => g.name).join(', ') : '');
  const [year, setYear] = useState(book?.year_of_publishing || '');
  const [isbn, setIsbn] = useState(book?.isbn || '');
  const [pages, setPages] = useState(book?.pages || '');
  const [notes, setNotes] = useState(book?.notes || '');
  const [coverUrl, setCoverUrl] = useState(book?.cover_url || '');
  const [status, setStatus] = useState(book?.status || 'UNREAD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (book && isOpen) {
      setTitle(book?.title || '');
      setAuthors(book?.authors ? book.authors.map((a: any) => a.first_name).join(', ') : '');
      setGenres(book?.genres ? book.genres.map((g: any) => g.name).join(', ') : '');
      setYear(book?.year_of_publishing || '');
      setIsbn(book?.isbn || '');
      setPages(book?.pages || '');
      setNotes(book?.notes || '');
      setCoverUrl(book?.cover_url || '');
      setStatus(book?.status || 'UNREAD');
    }
  }, [book, isOpen]);

  if (!isOpen || !book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateBook(book.book_id || book.id, {
        title,
        authors: authors ? authors.split(',').map(a => a.trim()).filter(Boolean) : [],
        genres: genres ? genres.split(',').map(g => g.trim()).filter(Boolean) : [],
        year_of_publishing: year ? Number(year) : null,
        isbn: isbn || null,
        pages: pages ? Number(pages) : null,
        notes: notes || null,
        cover_url: coverUrl || null,
        status: status || 'UNREAD',
      });
      setLoading(false);
      onClose();
      onBookUpdated();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Failed to update book');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Edit Book</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
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
            <label>
              Status
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="UNREAD">Unread</option>
                <option value="READING">Reading</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            {error && <div style={{color: 'red', marginTop: '8px'}}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBookModal;
