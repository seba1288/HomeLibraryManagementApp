import styles from "./BookCard.module.css";
import { useState } from "react";
import EditBookModal from "../../../components/EditBookModal/EditBookModal";

// Placeholder cover component
const PlaceholderCover = ({ title }: { title: string }) => (
    <div className={styles.placeholderCover}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 64 64" fill="none">
            <path d="M32 18.6667V56" stroke="#6A7282" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.99992 48C7.29267 48 6.6144 47.7191 6.1143 47.219C5.6142 46.7189 5.33325 46.0406 5.33325 45.3333V10.6667C5.33325 9.95942 5.6142 9.28115 6.1143 8.78105C6.6144 8.28095 7.29267 8 7.99992 8H21.3333C24.1622 8 26.8753 9.12381 28.8757 11.1242C30.8761 13.1246 31.9999 15.8377 31.9999 18.6667C31.9999 15.8377 33.1237 13.1246 35.1241 11.1242C37.1245 9.12381 39.8376 8 42.6666 8H55.9999C56.7072 8 57.3854 8.28095 57.8855 8.78105C58.3856 9.28115 58.6666 9.95942 58.6666 10.6667V45.3333C58.6666 46.0406 58.3856 46.7189 57.8855 47.219C57.3854 47.7191 56.7072 48 55.9999 48H39.9999C37.8782 48 35.8434 48.8429 34.3431 50.3431C32.8428 51.8434 31.9999 53.8783 31.9999 56C31.9999 53.8783 31.1571 51.8434 29.6568 50.3431C28.1565 48.8429 26.1216 48 23.9999 48H7.99992Z" stroke="#6A7282" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={styles.placeholderTitle}>{title}</span>
    </div>
);

type Author = {
    first_name?: string;
    last_name?: string;
    [key: string]: any;
};

type Book = {
    id?: string;
    title: string;
    authors?: Author[] | string[];
    pages?: number;
    current_page?: number;
    cover_url?: string;
    [key: string]: any;
};

interface BookCardProps {
    book: Book;
    onDelete?: (bookId: number) => void;
    onBookUpdated?: (updatedBook: Book) => void;
    disableMargins?: boolean;
    hideActions?: boolean;
    onAdd?: (book: Book) => void;
    isAdding?: boolean;
}

function BookCard({ book, onDelete, onBookUpdated, disableMargins, hideActions, onAdd, isAdding }: BookCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const hasValidCover = book.cover_url && !imgError;

    return (
        <div className={styles.bookCard} style={disableMargins ? { margin: 0 } : undefined}>
            <button className={styles.transparentbutton}>
                <div className={styles.background}>
                    {hasValidCover ? (
                        <img 
                            src={book.cover_url} 
                            alt={book.title} 
                            className={styles.coverImage}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <PlaceholderCover title={book.title} />
                    )}
                </div>
            </button>
            <div className={styles.InformationBox}>
                <button className={styles.titleAndAuthorBox}>
                    <div className={styles.titleBox}>
                        <h3 className={styles.title}>{book.title}</h3>
                    </div>
                    <div className={styles.authorBox}>
                        <p className={styles.rowTitle}>Author:</p>
                        <p className={styles.author}>{book.authors && book.authors.length ? book.authors.map((a: Author | string) => typeof a === 'string' ? a : a.first_name || 'Unknown').join(', ') : 'Unknown Author'}</p>
                    </div>
                </button>
                <div className={styles.pageCounterNumbersBox}>
                    <div className={styles.pageCounterNumbers}>
                        <p className={styles.rowTitle}>Pages:</p>
                        <p className={styles.pagesNumber}>{book.pages ? `${book.current_page || 0}/${book.pages}` : '0/0'}</p>
                    </div>
                </div>
                <div className={styles.pageCounterNumbersBox}>
                    <div className={styles.pageCounterNumbers}>
                        <p className={styles.rowTitle}>Year:</p>
                        <p className={styles.pagesNumber}>{book.year_of_publishing || 'Unknown'}</p>
                    </div>
                </div>
                {onAdd ? (
                     <div className={styles.editDeleteBox}>
                        <button 
                            className={styles.addButton} 
                            onClick={() => onAdd(book)}
                            disabled={isAdding}
                        >
                            {isAdding ? 'Adding...' : '+ Add to Library'}
                        </button>
                     </div>
                ) : !hideActions ? (
                    <div className={styles.editDeleteBox}>
                        <button className={styles.editButton} onClick={() => setIsEditOpen(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.editIcon}>
                                <path d="M8 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V8" stroke="#D1D5DC" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12.2499 1.74997C12.5151 1.48475 12.8748 1.33575 13.2499 1.33575C13.625 1.33575 13.9847 1.48475 14.2499 1.74997C14.5151 2.01518 14.6641 2.3749 14.6641 2.74997C14.6641 3.12504 14.5151 3.48475 14.2499 3.74997L8.24123 9.7593C8.08293 9.91747 7.88737 10.0332 7.67257 10.096L5.75723 10.656C5.69987 10.6727 5.63906 10.6737 5.58117 10.6589C5.52329 10.644 5.47045 10.6139 5.4282 10.5717C5.38594 10.5294 5.35583 10.4766 5.341 10.4187C5.32617 10.3608 5.32717 10.3 5.3439 10.2426L5.9039 8.3273C5.96692 8.11267 6.08292 7.91734 6.24123 7.7593L12.2499 1.74997Z" stroke="#D1D5DC" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className={styles.editText}>Edit</span>
                        </button>
                        <button className={styles.deleteButton} onClick={() => onDelete && onDelete(book.book_id || book.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.deleteIcon}>
                                <g clipPath="url(#clip0_1_171)">
                                    <path d="M6.66675 7.33331V11.3333" stroke="#FF6467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.33325 7.33331V11.3333" stroke="#FF6467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12.6666 4V13.3333C12.6666 13.687 12.5261 14.0261 12.2761 14.2761C12.026 14.5262 11.6869 14.6667 11.3333 14.6667H4.66659C4.31296 14.6667 3.97382 14.5262 3.72378 14.2761C3.47373 14.0261 3.33325 13.687 3.33325 13.3333V4" stroke="#FF6467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 4H14" stroke="#FF6467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5.33325 3.99998V2.66665C5.33325 2.31302 5.47373 1.97389 5.72378 1.72384C5.97383 1.47379 6.31296 1.33331 6.66659 1.33331H9.33325C9.68687 1.33331 10.026 1.47379 10.2761 1.72384C10.5261 1.97389 10.6666 2.31302 10.6666 2.66665V3.99998" stroke="#FF6467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_171">
                                        <rect width="16" height="16" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                ) : null}
                </div>
            <EditBookModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} book={book} onBookUpdated={onBookUpdated} />
        </div>
    );
}
export default BookCard;