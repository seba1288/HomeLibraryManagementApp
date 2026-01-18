import { useState, useEffect } from 'react';
import { getRecommendations, type RecommendationResult } from '../../services/recommendations/recommendations.service';
import { getBooks, createBook } from '../../services/books/books.service';
import BookCard from '../MyLibraryScreen/BookCard/BookCard';
import styles from './RecommendationsScreen.module.css';

function RecommendationsScreen() {
    const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingBookId, setAddingBookId] = useState<string | null>(null);

    useEffect(() => {
        loadRecommendations();
    }, []);

    async function loadRecommendations() {
        setLoading(true);
        try {
            // Fetch user books first to analyze
            const userBooks = await getBooks({ limit: 1000 });
            const recs = await getRecommendations(userBooks);
            setRecommendations(recs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddBook = async (book: any) => {
        setAddingBookId(book.id);
        try {
            await createBook({
                title: book.title,
                authors: book.authors.map((a: any) => a.first_name),
                cover_url: book.cover_url,
                pages: book.pageCount,
                year_of_publishing: book.publishedDate ? parseInt(book.publishedDate.split('-')[0]) : null,
                notes: null,
                status: 'UNREAD',
                isbn: book.isbn,
                genres: book.genres
            });
            alert(`Added "${book.title}" to your library!`);
            // Refresh recommendations to remove the added book? Or just leave it.
            // Let's remove it from the list locally for better UX
            setRecommendations(prev => prev.map(group => ({
                ...group,
                books: group.books.filter(b => b.id !== book.id)
            })));
        } catch (error: any) {
            console.error(error);
            alert(`Failed to add book: ${error.message || error}`);
        } finally {
            setAddingBookId(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.centeredContent}>
                <h2 className={styles.screenTitle}>Recommended for You</h2>
            </div>
            
            {loading ? (
                <div className={styles.loading}>Generating recommendations...</div>
            ) : (
                <div className={styles.scrollContainer}>
                    {recommendations.map((group, idx) => (
                        <div key={idx} className={styles.section}>
                            <div className={styles.centeredContent}>
                                <h3 className={styles.sectionTitle}>{group.category}</h3>
                            </div>
                            <div className={styles.carousel}>
                                {group.books.map((book) => (
                                    <div key={book.id} className={styles.bookWrapper}>
                                        <div className={styles.bookCardAdjust}>
                                            <BookCard 
                                                book={book} 
                                                disableMargins={true} 
                                                onAdd={() => handleAddBook(book)}
                                                isAdding={addingBookId === book.id}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {recommendations.length === 0 && !loading && (
                        <div className={styles.centeredContent}>
                            <p className={styles.empty}>Add more books to your library to get better recommendations!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default RecommendationsScreen;
