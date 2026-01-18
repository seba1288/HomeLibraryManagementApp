import styles from './EditBookModal.module.css';
import { useState, useEffect } from 'react';
import { updateBook } from '../../services/books/books.service';
import { getAllAuthors, createAuthor, getAuthorFullName } from '../../services/authors/authors.service';
import { getAllPublishers } from '../../services/publishers/publishers.service';
import type { Author, Publisher } from '../../../interfaces/types';

type EditBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  book: any;
  onBookUpdated: () => void;
};

function EditBookModal({ isOpen, onClose, book, onBookUpdated }: EditBookModalProps) {
  const [title, setTitle] = useState(book?.title || '');
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState(book?.genres ? book.genres.map((g: any) => g.name).join(', ') : '');
  const [year, setYear] = useState(book?.year_of_publishing || '');
  const [isbn, setIsbn] = useState(book?.isbn || '');
  const [pages, setPages] = useState(book?.pages || '');
  const [notes, setNotes] = useState(book?.notes || '');
  const [coverUrl, setCoverUrl] = useState(book?.cover_url || '');
  const [status, setStatus] = useState(book?.status || 'UNREAD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isbnError, setIsbnError] = useState<string | null>(null);

  // Author form state
  const [showAddAuthor, setShowAddAuthor] = useState(false);
  const [newAuthorFirstName, setNewAuthorFirstName] = useState('');
  const [newAuthorMiddleName, setNewAuthorMiddleName] = useState('');
  const [newAuthorLastName, setNewAuthorLastName] = useState('');
  const [newAuthorAlias, setNewAuthorAlias] = useState('');
  const [newAuthorMonastery, setNewAuthorMonastery] = useState('');
  const [newAuthorTitle, setNewAuthorTitle] = useState('');
  const [addingAuthor, setAddingAuthor] = useState(false);
  const [authorSearch, setAuthorSearch] = useState('');

  // Publisher state
  const [selectedPublisher, setSelectedPublisher] = useState<number | null>(null);
  const [availablePublishers, setAvailablePublishers] = useState<Publisher[]>([]);
  const [publisherSearch, setPublisherSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadAuthors();
      loadPublishers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (book && isOpen) {
      setTitle(book?.title || '');
      setGenres(book?.genres ? book.genres.map((g: any) => g.name).join(', ') : '');
      setYear(book?.year_of_publishing || '');
      setIsbn(book?.isbn || '');
      setPages(book?.pages || '');
      setNotes(book?.notes || '');
      setCoverUrl(book?.cover_url || '');
      setStatus(book?.status || 'UNREAD');
      setSelectedPublisher(book?.publisher_id || null);
      
      // Set selected authors from book data
      if (book?.authors && book.authors.length > 0) {
        setSelectedAuthors(book.authors.map((a: any) => a.id));
      } else {
        setSelectedAuthors([]);
      }
    }
  }, [book, isOpen]);

  const loadAuthors = async () => {
    try {
      const authors = await getAllAuthors();
      setAvailableAuthors(authors);
    } catch (err) {
      console.error('Failed to load authors:', err);
    }
  };

  const loadPublishers = async () => {
    try {
      const publishers = await getAllPublishers();
      setAvailablePublishers(publishers);
    } catch (err) {
      console.error('Failed to load publishers:', err);
    }
  };

  const handleAddAuthor = async () => {
    if (!newAuthorFirstName.trim()) {
      setError('Author first name is required');
      return;
    }
    setAddingAuthor(true);
    setError(null);
    try {
      const newAuthor = await createAuthor({
        first_name: newAuthorFirstName.trim(),
        middle_name: newAuthorMiddleName.trim() || null,
        last_name: newAuthorLastName.trim() || null,
        alias: newAuthorAlias.trim() || null,
        monastery: newAuthorMonastery.trim() || null,
        title: newAuthorTitle.trim() || null,
      });
      await loadAuthors();
      setSelectedAuthors([...selectedAuthors, newAuthor.id]);
      setNewAuthorFirstName('');
      setNewAuthorMiddleName('');
      setNewAuthorLastName('');
      setNewAuthorAlias('');
      setNewAuthorMonastery('');
      setNewAuthorTitle('');
      setShowAddAuthor(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to add author');
    }
    setAddingAuthor(false);
  };

  const getAuthorDisplayName = (author: Author) => {
    return getAuthorFullName(author);
  };

  const filteredAuthors = availableAuthors.filter(author => {
    if (!authorSearch.trim()) return true;
    const searchLower = authorSearch.toLowerCase();
    const displayName = getAuthorDisplayName(author).toLowerCase();
    return displayName.includes(searchLower);
  });

  const filteredPublishers = availablePublishers.filter(publisher => {
    if (!publisherSearch.trim()) return true;
    return publisher.name.toLowerCase().includes(publisherSearch.toLowerCase());
  });

  if (!isOpen || !book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const authorNames = selectedAuthors.map(id => {
        const author = availableAuthors.find(a => a.id === id);
        return author ? getAuthorFullName(author) : '';
      }).filter(Boolean);

      await updateBook(book.book_id || book.id, {
        title,
        authors: authorNames,
        genres: genres ? genres.split(',').map(g => g.trim()).filter(Boolean) : [],
        year_of_publishing: year ? Number(year) : null,
        isbn: isbn || null,
        pages: pages ? Number(pages) : null,
        notes: notes || null,
        cover_url: coverUrl || null,
        status: status || 'UNREAD',
        publisher_id: selectedPublisher || null,
      });
      setLoading(false);
      onClose();
      onBookUpdated();
    } catch (err: any) {
      setLoading(false);
      const errorMsg = err?.message || 'Failed to update book';
      if (errorMsg.startsWith('ISBN_DUPLICATE:')) {
        setIsbnError('A book with this ISBN already exists');
      } else {
        setError(errorMsg);
      }
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

            {/* Add Author Form - Above dropdown */}
            {showAddAuthor && (
              <div className={styles.addAuthorForm}>
                <h4>Add New Author</h4>
                <div className={styles.authorFields}>
                  <input
                    type="text"
                    placeholder="First Name *"
                    value={newAuthorFirstName}
                    onChange={e => setNewAuthorFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Middle Name"
                    value={newAuthorMiddleName}
                    onChange={e => setNewAuthorMiddleName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newAuthorLastName}
                    onChange={e => setNewAuthorLastName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Alias"
                    value={newAuthorAlias}
                    onChange={e => setNewAuthorAlias(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Monastery"
                    value={newAuthorMonastery}
                    onChange={e => setNewAuthorMonastery(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Title (e.g., Dr., Fr.)"
                    value={newAuthorTitle}
                    onChange={e => setNewAuthorTitle(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className={styles.saveAuthorButton}
                  onClick={handleAddAuthor}
                  disabled={addingAuthor}
                >
                  {addingAuthor ? 'Adding...' : 'Save Author'}
                </button>
              </div>
            )}

            {/* Authors Section */}
            <div className={styles.authorSection}>
              <div className={styles.authorHeader}>
                <span>Authors</span>
                <button 
                  type="button" 
                  className={styles.addAuthorButton}
                  onClick={() => setShowAddAuthor(!showAddAuthor)}
                >
                  {showAddAuthor ? 'Cancel' : '+ Add Author'}
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Search authors..."
                value={authorSearch}
                onChange={e => setAuthorSearch(e.target.value)}
                className={styles.authorSearchInput}
              />
              
              <select
                multiple
                value={selectedAuthors.map(String)}
                onChange={(e) => {
                  const clickedValues = Array.from(e.target.selectedOptions, option => Number(option.value));
                  const newSelection = [...selectedAuthors];
                  for (const val of clickedValues) {
                    if (!newSelection.includes(val)) {
                      newSelection.push(val);
                    }
                  }
                  setSelectedAuthors(newSelection);
                }}
                className={styles.authorSelect}
              >
                {filteredAuthors.map(author => (
                  <option key={author.id} value={author.id}>
                    {getAuthorDisplayName(author)}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Authors Display */}
            {selectedAuthors.length > 0 && (
              <div className={styles.selectedAuthors}>
                <span>Selected: </span>
                {selectedAuthors.map(id => {
                  const author = availableAuthors.find(a => a.id === id);
                  return author ? (
                    <span key={id} className={styles.authorTag}>
                      {getAuthorDisplayName(author)}
                      <button
                        type="button"
                        onClick={() => setSelectedAuthors(selectedAuthors.filter(a => a !== id))}
                        className={styles.removeAuthor}
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            <label>
              Genres (comma separated)
              <input type="text" value={genres} onChange={e => setGenres(e.target.value)} />
            </label>

            {/* Publisher Section */}
            <div className={styles.publisherSection}>
              <span className={styles.publisherLabel}>Publisher</span>
              <input
                type="text"
                placeholder="Search publisher..."
                value={publisherSearch}
                onChange={e => setPublisherSearch(e.target.value)}
                className={styles.publisherSearchInput}
              />
              <select
                value={selectedPublisher || ''}
                onChange={(e) => setSelectedPublisher(e.target.value ? Number(e.target.value) : null)}
                className={styles.publisherSelect}
              >
                <option value="">-- Select Publisher --</option>
                {filteredPublishers.map(publisher => (
                  <option key={publisher.id} value={publisher.id}>
                    {publisher.name}
                  </option>
                ))}
              </select>
              {selectedPublisher && (
                <div className={styles.selectedPublisher}>
                  <span>Selected: {availablePublishers.find(p => p.id === selectedPublisher)?.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedPublisher(null)}
                    className={styles.removePublisher}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <label>
              Year of Publishing
              <input type="number" value={year} onChange={e => setYear(e.target.value)} />
            </label>
            <label>
              ISBN
              <input type="text" value={isbn} onChange={e => { setIsbn(e.target.value); setIsbnError(null); }} />
              {isbnError && <span className={styles.fieldError}>{isbnError}</span>}
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
