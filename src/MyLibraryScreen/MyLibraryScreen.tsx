import BookCount from "./BookCount/BookCount.tsx";
import SearchAndFilterOptions from "./SearchAndFilterOptions/SearchAndFilterOptions.tsx";
import BookCard from "./BookCard/BookCard.tsx";
import styles from "./MyLibraryScreen.module.css";
import { deleteBook, getBooks } from "../services/books/books.service";


import React, { useState, useEffect } from "react";

function MyLibraryScreen({ onBookDeleted }: { onBookDeleted: () => void }) {
    const [books, setBooks] = useState<any[]>([]);
    const [allBooks, setAllBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("date_desc");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [filters, setFilters] = useState({
        status: "All Status",
        genre: "All Genres",
        author: "All Authors"
    });

    useEffect(() => {
        async function fetchBooks() {
            setLoading(true);
            const result = await getBooks({ limit: 100 });
            setAllBooks(result);
            applyFiltersAndSort(result, sort, filters);
            setLoading(false);
        }
        fetchBooks();
    }, [refreshTrigger]);

    const applyFiltersAndSort = (booksToFilter: any[], sortType: string, currentFilters: any) => {
        let filtered = [...booksToFilter];

        // Apply filters
        if (currentFilters.status !== "All Status") {
            filtered = filtered.filter((book: any) => {
                console.log(`Comparing book status: "${book.status}" with filter: "${currentFilters.status}"`, book.status === currentFilters.status);
                return book.status === currentFilters.status;
            });
        }
        if (currentFilters.author !== "All Authors") {
            filtered = filtered.filter((book: any) =>
                book.authors && book.authors.some((a: any) => a.first_name === currentFilters.author)
            );
        }
        if (currentFilters.genre !== "All Genres") {
            filtered = filtered.filter((book: any) =>
                book.genres && book.genres.some((g: any) => g.name === currentFilters.genre)
            );
        }

        // Apply sort
        let orderField = "id";
        let ascending = false;
        if (sortType === "date_asc") {
            orderField = "id";
            ascending = true;
        } else if (sortType === "title_asc") {
            orderField = "title";
            ascending = true;
        } else if (sortType === "title_desc") {
            orderField = "title";
            ascending = false;
        }

        let sorted = [...filtered];
        if (orderField === "id") {
            sorted.sort((a, b) => ascending ? a.id - b.id : b.id - a.id);
        } else if (orderField === "title") {
            sorted.sort((a, b) => {
                const titleA = (a.title || "").toLowerCase();
                const titleB = (b.title || "").toLowerCase();
                if (titleA < titleB) return ascending ? -1 : 1;
                if (titleA > titleB) return ascending ? 1 : -1;
                return 0;
            });
        }
        setBooks(sorted);
    };

    useEffect(() => {
        applyFiltersAndSort(allBooks, sort, filters);
    }, [sort, filters]);

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    const handleDelete = async (bookId: number) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await deleteBook(bookId);
            setRefreshTrigger(prev => prev + 1);
            onBookDeleted();
        } catch (err) {
            alert("Failed to delete book.");
        }
    };

    return (
        <>
            <SearchAndFilterOptions onSortChange={setSort} onFilterChange={handleFilterChange} />
            <BookCount />
            {loading ? (
                <p>Loading books...</p>
            ) : (
                books.length === 0 ? (
                    <p>No books found.</p>
                ) : (
                    <div className={styles.booksGrid}>
                        {books.map((book, idx) => (
                            <BookCard key={idx} book={book} onDelete={handleDelete} onBookUpdated={() => setRefreshTrigger(prev => prev + 1)} />
                        ))}
                    </div>
                )
            )}
        </>
    );
}

export default MyLibraryScreen;