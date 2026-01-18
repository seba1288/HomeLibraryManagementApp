import { useState, useEffect } from 'react';
import { getShelfBooks, removeBookFromShelf, addBookToShelf } from '../../services/shelves/shelves.service';
import type { Shelf } from '../../services/shelves/shelves.service';
import { getBooks } from '../../services/books/books.service';
import BookCard from '../MyLibraryScreen/BookCard/BookCard';
import styles from './ShelfDetailsScreen.module.css';

type ShelfDetailsScreenProps = {
    shelf: Shelf;
    onBack: () => void;
};

function ShelfDetailsScreen({ shelf, onBack }: ShelfDetailsScreenProps) {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [availableBooks, setAvailableBooks] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadShelfBooks();
    }, [shelf.id]);

    async function loadShelfBooks() {
        setLoading(true);
        try {
            const data = await getShelfBooks(shelf.id);
            setBooks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleRemoveBook = async (bookId: number) => {
        if (!window.confirm('Remove this book from shelf?')) return;
        try {
            await removeBookFromShelf(shelf.id, bookId);
            loadShelfBooks();
        } catch (error) {
            console.error(error);
            alert('Failed to remove book');
        }
    };

    const loadAvailableBooks = async () => {
        // Fetch all books to select from. Ideally this should be paginated or searchable server-side.
        // For now, fetching all (limit 1000) and filtering client side.
        try {
            const data = await getBooks({ limit: 1000 });
            setAvailableBooks(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
        loadAvailableBooks();
    };

    const handleAddBook = async (bookId: number) => {
        try {
            await addBookToShelf(shelf.id, bookId);
            setIsAddModalOpen(false);
            loadShelfBooks();
        } catch (error) {
            console.error(error);
            alert('Failed to add book (it might already be in the shelf)');
        }
    };

    const filteredAvailableBooks = availableBooks.filter(book => 
        !books.some(b => b.id === book.id) && 
        (book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         (book.authors && book.authors.some((a: any) => a.first_name.toLowerCase().includes(searchQuery.toLowerCase()))))
    );

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={onBack}>
                ← Back to Shelves
            </button>
            <div className={styles.header}>
                <h2>{shelf.name}</h2>
                <button className={styles.addButton} onClick={handleOpenAddModal}>
                    + Add Book
                </button>
            </div>

            {loading ? (
                <p>Loading books...</p>
            ) : books.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>This shelf is empty.</p>
                </div>
            ) : (
                <div className={styles.booksGrid}>
                    {books.map((book, idx) => (
                        <div key={idx} className={styles.bookWrapper}>
                             <BookCard book={book} onDelete={() => handleRemoveBook(book.id)} />
                        </div>
                    ))}
                </div>
            )}

            {isAddModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Add Book to Shelf</h3>
                            <button className={styles.closeButton} onClick={() => setIsAddModalOpen(false)}>✕</button>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search books..." 
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className={styles.bookList}>
                            {filteredAvailableBooks.map(book => (
                                <div key={book.id} className={styles.bookOption} onClick={() => handleAddBook(book.id)}>
                                    <div className={styles.bookOptionCover}>
                                        {book.cover_url ? <img src={book.cover_url} alt={book.title} /> : <div className={styles.placeholder}>B</div>}
                                    </div>
                                    <div className={styles.bookOptionInfo}>
                                        <p className={styles.bookOptionTitle}>{book.title}</p>
                                        <p className={styles.bookOptionAuthor}>{book.authors?.map((a: any) => a.first_name).join(', ')}</p>
                                    </div>
                                    <button className={styles.addOptionButton}>+</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShelfDetailsScreen;
