import styles from "./SearchAndFilterOptions.module.css";


function SearchAndFilterOprions() {

    return (
        <>
        <div className={styles.SearchAndFiltersBar}>
            <div className={styles.searchContainer}>
                <form>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.searchIcon} >
                            <path d="M17.5 17.5L13.8833 13.8833" stroke="#6A7282" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#6A7282" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input type="search" placeholder="Search books..." className={styles.searchText}/>
                </form>
            </div>

            <div className={styles.filtersAndViewContainer}>
                <button className={styles.filterButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clip-path="url(#clip0_1_100)">
                            <path d="M8.33336 16.6667C8.33329 16.8215 8.37637 16.9733 8.45777 17.1051C8.53917 17.2368 8.65566 17.3433 8.79419 17.4125L10.4609 18.2458C10.5879 18.3093 10.7291 18.3393 10.8711 18.3329C11.013 18.3264 11.1509 18.2838 11.2717 18.2091C11.3925 18.1344 11.4922 18.03 11.5614 17.9059C11.6305 17.7818 11.6668 17.6421 11.6667 17.5V11.6667C11.6669 11.2537 11.8204 10.8554 12.0975 10.5492L18.1167 3.89167C18.2246 3.77213 18.2955 3.6239 18.3209 3.4649C18.3464 3.3059 18.3252 3.14294 18.2599 2.99573C18.1947 2.84851 18.0882 2.72335 17.9534 2.63538C17.8185 2.5474 17.661 2.50038 17.5 2.5H2.50003C2.33886 2.50006 2.18118 2.54685 2.04607 2.6347C1.91096 2.72255 1.80422 2.84769 1.73878 2.99497C1.67334 3.14225 1.65201 3.30534 1.67738 3.46449C1.70274 3.62364 1.77371 3.77203 1.88169 3.89167L7.90252 10.5492C8.17964 10.8554 8.33317 11.2537 8.33336 11.6667V16.6667Z" stroke="#D1D5DC" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" className={styles.filterIcon}/>
                        </g>
                        <defs>
                            <clipPath id="clip0_1_100">
                            <rect width="20" height="20" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    <span className={styles.filtersText}>Filters</span>
                </button>
                <button className={styles.cardViewButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="#A3B3FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" className={styles.cardViewIcon}/>
                        <path d="M2.5 7.5H17.5" stroke="#A3B3FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2.5 12.5H17.5" stroke="#A3B3FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7.5 2.5V17.5" stroke="#A3B3FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.5 2.5V17.5" stroke="#A3B3FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button className={styles.listViewButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.listViewIcon}>
                        <path d="M2.5 4.16667H2.50833" stroke="#D1D5DC" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2.5 10H2.50833" stroke="#D1D5DC" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2.5 15.8333H2.50833" stroke="#D1D5DC" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.66675 4.16667H17.5001" stroke="#D1D5DC" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.66675 10H17.5001" stroke="#D1D5DC" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.66675 15.8333H17.5001" stroke="#D1D5DC" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
        
        </>
    );
}

export default SearchAndFilterOprions;