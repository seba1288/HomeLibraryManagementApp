
import React, { useState, useRef, useEffect } from "react";
import styles from "./SearchAndFilterOptions.module.css";
import { supabase } from "../../services/supabase";


function SearchAndFilterOptions({ onSortChange, onFilterChange }: { onSortChange: (sort: string) => void; onFilterChange?: (filters: any) => void }) {
    const [showFilters, setShowFilters] = useState(false);
    const [showSortBy, setShowSortBy] = useState(false);
    const [sortBy, setSortBy] = useState("date_desc");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [genreFilter, setGenreFilter] = useState("All Genres");
    const [authorFilter, setAuthorFilter] = useState("All Authors");
    const [authors, setAuthors] = useState<any[]>([]);
    const [genres, setGenres] = useState<any[]>([]);
    const filterPanelRef = useRef<HTMLDivElement>(null);
    const sortPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchAuthors() {
            try {
                const { data, error } = await supabase
                    .from('authors')
                    .select('id, first_name')
                    .order('first_name', { ascending: true });
                
                if (error) throw error;
                setAuthors(data || []);
            } catch (err) {
                console.error('Failed to fetch authors:', err);
            }
        }
        fetchAuthors();
    }, []);

    useEffect(() => {
        async function fetchGenres() {
            try {
                const { data, error } = await supabase
                    .from('genres')
                    .select('id, name')
                    .order('name', { ascending: true });
                
                if (error) throw error;
                setGenres(data || []);
            } catch (err) {
                console.error('Failed to fetch genres:', err);
            }
        }
        fetchGenres();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                filterPanelRef.current &&
                !filterPanelRef.current.contains(event.target as Node)
            ) {
                setShowFilters(false);
            }
            if (
                sortPanelRef.current &&
                !sortPanelRef.current.contains(event.target as Node)
            ) {
                setShowSortBy(false);
            }
        }
        if (showFilters || showSortBy) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilters, showSortBy]);

    useEffect(() => {
        onSortChange(sortBy);
    }, [sortBy, onSortChange]);

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                status: statusFilter,
                genre: genreFilter,
                author: authorFilter
            });
        }
    }, [statusFilter, genreFilter, authorFilter, onFilterChange]);

    return (
        <>
            <div className={styles.SearchAndFiltersBar}>
                <div className={styles.searchContainer}>
                    <form>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.searchIcon} >
                            <path d="M17.5 17.5L13.8833 13.8833" stroke="#6A7282" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#6A7282" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input type="search" placeholder="Search books..." className={styles.searchText}/>
                    </form>
                </div>

                <div className={styles.filtersAndViewContainer}>
                    <button
                        className={styles.filterButton}
                        type="button"
                        onClick={() => setShowFilters((prev) => !prev)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <g clipPath="url(#clip0_1_100)">
                                <path d="M8.33336 16.6667C8.33329 16.8215 8.37637 16.9733 8.45777 17.1051C8.53917 17.2368 8.65566 17.3433 8.79419 17.4125L10.4609 18.2458C10.5879 18.3093 10.7291 18.3393 10.8711 18.3329C11.013 18.3264 11.1509 18.2838 11.2717 18.2091C11.3925 18.1344 11.4922 18.03 11.5614 17.9059C11.6305 17.7818 11.6668 17.6421 11.6667 17.5V11.6667C11.6669 11.2537 11.8204 10.8554 12.0975 10.5492L18.1167 3.89167C18.2246 3.77213 18.2955 3.6239 18.3209 3.4649C18.3464 3.3059 18.3252 3.14294 18.2599 2.99573C18.1947 2.84851 18.0882 2.72335 17.9534 2.63538C17.8185 2.5474 17.661 2.50038 17.5 2.5H2.50003C2.33886 2.50006 2.18118 2.54685 2.04607 2.6347C1.91096 2.72255 1.80422 2.84769 1.73878 2.99497C1.67334 3.14225 1.65201 3.30534 1.67738 3.46449C1.70274 3.62364 1.77371 3.77203 1.88169 3.89167L7.90252 10.5492C8.17964 10.8554 8.33317 11.2537 8.33336 11.6667V16.6667Z" stroke="#D1D5DC" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" className={styles.filterIcon}/>
                            </g>
                            <defs>
                                <clipPath id="clip0_1_100">
                                    <rect width="20" height="20" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span className={styles.filtersText}>Filters</span>
                    </button>
                    {showFilters && (
                        <div className={styles.filtersPanel} ref={filterPanelRef}>
                            <div className={styles.filtersTitle}>Filters</div>
                            <div className={styles.filtersRow}>
                                <div className={styles.filterGroup}>
                                    <label>Status</label>
                                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                        <option value="All Status">All Status</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="UNREAD">Unread</option>
                                        <option value="READING">Reading</option>
                                    </select>
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Genre</label>
                                    <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
                                        <option value="All Genres">All Genres</option>
                                        {genres.map((genre: any) => (
                                            <option key={genre.id} value={genre.name}>{genre.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Author</label>
                                    <select value={authorFilter} onChange={e => setAuthorFilter(e.target.value)}>
                                        <option value="All Authors">All Authors</option>
                                        {authors.map((author: any) => (
                                            <option key={author.id} value={author.first_name}>{author.first_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        className={styles.sortByButton}
                        type="button"
                        onClick={() => setShowSortBy((prev) => !prev)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3.33333 5H16.6667" stroke="#D1D5DC" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3.33333 10H16.6667" stroke="#D1D5DC" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3.33333 15H16.6667" stroke="#D1D5DC" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className={styles.sortByText}>Sort By</span>
                    </button>
                    {showSortBy && (
                        <div className={styles.sortByPanel} ref={sortPanelRef}>
                            <div className={styles.sortByTitle}>Sort By</div>
                            <div className={styles.sortByOptions}>
                                <div className={styles.sortOption}>
                                    <select value={sortBy} onChange={e => {
                                        setSortBy(e.target.value);
                                        setShowSortBy(false);
                                    }}>
                                        <option value="date_desc">Date Added (Newest)</option>
                                        <option value="date_asc">Date Added (Oldest)</option>
                                        <option value="title_asc">Title (A-Z)</option>
                                        <option value="title_desc">Title (Z-A)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ...existing code... */}
                </div>
                {/* ...existing code... */}
            </div>
        </>
    );
}

export default SearchAndFilterOptions;