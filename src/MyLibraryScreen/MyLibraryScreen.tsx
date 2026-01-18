import BookCount from "./BookCount/BookCount.tsx";
import SearchAndFilterOprions from "./SearchAndFilterOptions/SearchAndFilterOptions.tsx";
import BookCard from "./BookCard/BookCard.tsx";
import styles from "./MyLibraryScreen.module.css";
import { deleteBook } from "../services/books/books.service";

function MyLibraryScreen({ books, loading, onBookDeleted }: { books: any[]; loading: boolean; onBookDeleted: () => void }) {
    const handleDelete = async (bookId: number) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await deleteBook(bookId);
            onBookDeleted();
        } catch (err) {
            alert("Failed to delete book.");
        }
    };
    return (
        <>
            <SearchAndFilterOprions/>
            <BookCount/>
            {loading ? (
                <p>Loading books...</p>
            ) : (
                books.length === 0 ? (
                    <p>No books found.</p>
                ) : (
                    <div className={styles.booksGrid}>
                        {books.map((book, idx) => (
                            <BookCard key={idx} book={book} onDelete={handleDelete} onBookUpdated={onBookDeleted} />
                        ))}
                    </div>
                )
            )}
        </>
    );
}

export default MyLibraryScreen;