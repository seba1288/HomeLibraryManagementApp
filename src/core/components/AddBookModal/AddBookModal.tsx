import styles from './AddBookModal.module.css';
import { useState, useEffect } from 'react';
import { createBook } from '../../services/books/books.service';
import { getAllAuthors, createAuthor, parseAuthorName, getAuthorFullName } from '../../services/authors/authors.service';
import { getAllPublishers, createPublisher } from '../../services/publishers/publishers.service';
import { fetchBookCover, fetchBookInfoFromGoogle } from '../../services/library';
import type { Author, Publisher } from '../../../interfaces/types';

type AddBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: () => void;
};

function AddBookModal({ isOpen, onClose, onBookAdded }: AddBookModalProps) {
  const [title, setTitle] = useState('');
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState('');
  const [year, setYear] = useState('');
  const [isbn, setIsbn] = useState('');
  const [pages, setPages] = useState('');
  const [notes, setNotes] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCover, setFetchingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isbnError, setIsbnError] = useState<string | null>(null);
  
  // Add Author form state
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
  const [addingPublisher, setAddingPublisher] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAuthors();
      loadPublishers();
    }
  }, [isOpen]);

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

  const handleAddPublisher = async () => {
    if (!publisherSearch.trim()) {
      setError('Publisher name is required');
      return;
    }
    setAddingPublisher(true);
    setError(null);
    try {
      const newPublisher = await createPublisher(publisherSearch.trim());
      await loadPublishers();
      setSelectedPublisher(newPublisher.id);
      setPublisherSearch('');
    } catch (err: any) {
      setError(err?.message || 'Failed to add publisher');
    }
    setAddingPublisher(false);
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

  if (!isOpen) return null;

  const handleFetchCover = async () => {
    if (!title && !isbn) {
      setError('Enter a title or ISBN to fetch cover');
      return;
    }
    setFetchingCover(true);
    setError(null);
    try {
      const selectedAuthorNames = selectedAuthors.map(id => {
        const author = availableAuthors.find(a => a.id === id);
        return author ? getAuthorFullName(author) : '';
      });
      const cover = await fetchBookCover(title, selectedAuthorNames[0] || '', isbn);
      if (cover) {
        setCoverUrl(cover);
      } else {
        setError('No cover found for this book');
      }
    } catch {
      setError('Failed to fetch cover');
    }
    setFetchingCover(false);
  };

  const handleAutoFill = async () => {
    if (!title && !isbn) {
      setError('Enter a title or ISBN to auto-fill');
      return;
    }
    setFetchingCover(true);
    setError(null);
    try {
      const selectedAuthorNames = selectedAuthors.map(id => {
        const author = availableAuthors.find(a => a.id === id);
        return author ? getAuthorFullName(author) : '';
      });
      const info = await fetchBookInfoFromGoogle(title, selectedAuthorNames[0] || '', isbn);
      if (info) {
        if (info.title && !title) setTitle(info.title);
        if (info.publishedDate && !year) setYear(info.publishedDate.split('-')[0]);
        if (info.pageCount && !pages) setPages(String(info.pageCount));
        if (info.coverUrl && !coverUrl) setCoverUrl(info.coverUrl);
        if (info.isbn && !isbn) setIsbn(info.isbn);
        if (info.categories?.length && !genres) setGenres(info.categories.join(', '));
        
        // Handle authors from Google - create them if they don't exist and select them
        if (info.authors?.length && selectedAuthors.length === 0) {
          const newSelectedAuthors: number[] = [];
          for (const authorName of info.authors) {
            // Check if author already exists (by full name match)
            const existingAuthor = availableAuthors.find(
              a => getAuthorFullName(a).toLowerCase() === authorName.toLowerCase()
            );
            if (existingAuthor) {
              // Only add if not already in the list
              if (!newSelectedAuthors.includes(existingAuthor.id)) {
                newSelectedAuthors.push(existingAuthor.id);
              }
            } else {
              // Create new author - parse the full name into parts
              try {
                const nameParts = parseAuthorName(authorName);
                const newAuthor = await createAuthor({
                  first_name: nameParts.first_name,
                  middle_name: nameParts.middle_name,
                  last_name: nameParts.last_name,
                });
                if (!newSelectedAuthors.includes(newAuthor.id)) {
                  newSelectedAuthors.push(newAuthor.id);
                }
              } catch {
                // If creation fails, skip this author
                console.error('Failed to create author:', authorName);
              }
            }
          }
          if (newSelectedAuthors.length > 0) {
            await loadAuthors(); // Reload authors list
            // Use unique IDs only
            setSelectedAuthors([...new Set(newSelectedAuthors)]);
          }
        }

        // Handle publisher from Google - create if doesn't exist and select it
        if (info.publisher && !selectedPublisher) {
          // Check if publisher already exists
          const existingPublisher = availablePublishers.find(
            p => p.name.toLowerCase() === info.publisher.toLowerCase()
          );
          if (existingPublisher) {
            setSelectedPublisher(existingPublisher.id);
          } else {
            // Create new publisher
            try {
              const newPub = await createPublisher(info.publisher);
              await loadPublishers();
              setSelectedPublisher(newPub.id);
            } catch {
              console.error('Failed to create publisher:', info.publisher);
            }
          }
        }
      } else {
        setError('No book info found');
      }
    } catch {
      setError('Failed to fetch book info');
    }
    setFetchingCover(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const authorNames = selectedAuthors.map(id => {
        const author = availableAuthors.find(a => a.id === id);
        return author ? getAuthorFullName(author) : '';
      }).filter(Boolean);
      
      await createBook({
        title,
        authors: authorNames,
        genres: genres ? genres.split(',').map(g => g.trim()).filter(Boolean) : [],
        year_of_publishing: year ? Number(year) : null,
        isbn: isbn || null,
        pages: pages ? Number(pages) : null,
        notes: notes || null,
        cover_url: coverUrl || null,
        publisher_id: selectedPublisher || null,
      });
      setLoading(false);
      onClose();
      onBookAdded();
      setTitle(''); setSelectedAuthors([]); setGenres(''); setYear(''); setIsbn(''); setPages(''); setNotes(''); setCoverUrl(''); setSelectedPublisher(null); setPublisherSearch('');
    } catch (err: any) {
      setLoading(false);
      const errorMsg = err?.message || 'Failed to add book';
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
              
              {/* Search Input */}
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
                  // Merge with existing selections - add new ones, keep existing ones
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
              <div className={styles.publisherSearchRow}>
                <input
                  type="text"
                  placeholder="Search or type new publisher..."
                  value={publisherSearch}
                  onChange={e => setPublisherSearch(e.target.value)}
                  className={styles.publisherSearchInput}
                />
                <button
                  type="button"
                  className={styles.addPublisherButton}
                  onClick={async () => {
                    if (!publisherSearch.trim()) return;
                    setAddingPublisher(true);
                    try {
                      const newPub = await createPublisher(publisherSearch.trim());
                      await loadPublishers();
                      setSelectedPublisher(newPub.id);
                      setPublisherSearch('');
                    } catch (err: any) {
                      setError(err?.message || 'Failed to add publisher');
                    }
                    setAddingPublisher(false);
                  }}
                  disabled={addingPublisher || !publisherSearch.trim()}
                  title="Add new publisher"
                >
                  {addingPublisher ? '...' : '+'}
                </button>
              </div>
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
              <input type="text" value={isbn} onChange={e => { setIsbn(e.target.value); setIsbnError(null); }} placeholder="e.g. 9780743273565" />
              {isbnError && <span className={styles.fieldError}>{isbnError}</span>}
            </label>
            <div className={styles.fetchButtons}>
              <button type="button" onClick={handleFetchCover} disabled={fetchingCover} className={styles.fetchButton}>
                {fetchingCover ? 'Fetching...' : 'Fetch Cover'}
              </button>
              <button type="button" onClick={handleAutoFill} disabled={fetchingCover} className={styles.fetchButton}>
                {fetchingCover ? 'Fetching...' : 'Auto-Fill from Google'}
              </button>
            </div>
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
              <input type="text" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="Auto-filled or enter manually" />
            </label>
            {coverUrl && (
              <div className={styles.coverPreview}>
                <img src={coverUrl} alt="Book cover preview" />
              </div>
            )}
            <button type="submit" disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.AddBookIcon}>
                <path d="M12.6667 2.5C13.1063 2.50626 13.5256 2.68598 13.8333 3L17 6.16667C17.314 6.47438 17.4937 6.89372 17.5 7.33333V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H12.6667Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.1668 17.5V11.6667C14.1668 11.4457 14.079 11.2337 13.9228 11.0775C13.7665 10.9212 13.5545 10.8334 13.3335 10.8334H6.66683C6.44582 10.8334 6.23385 10.9212 6.07757 11.0775C5.92129 11.2337 5.8335 11.4457 5.8335 11.6667V17.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.8335 2.5V5.83333C5.8335 6.05435 5.92129 6.26631 6.07757 6.42259C6.23385 6.57887 6.44582 6.66667 6.66683 6.66667H12.5002" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
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
