import styles from "./BookCard.module.css";


function BookCard() {

    return (
        <>
        <div className={styles.bookCard}>
            <button className={styles.photoHolder}>
                <div className={styles.backgroud}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" className={styles.icon}>
                        <path d="M32 18.6667V56" stroke="#6A7282" stroke-width="5.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7.99992 48C7.29267 48 6.6144 47.7191 6.1143 47.219C5.6142 46.7189 5.33325 46.0406 5.33325 45.3333V10.6667C5.33325 9.95942 5.6142 9.28115 6.1143 8.78105C6.6144 8.28095 7.29267 8 7.99992 8H21.3333C24.1622 8 26.8753 9.12381 28.8757 11.1242C30.8761 13.1246 31.9999 15.8377 31.9999 18.6667C31.9999 15.8377 33.1237 13.1246 35.1241 11.1242C37.1245 9.12381 39.8376 8 42.6666 8H55.9999C56.7072 8 57.3854 8.28095 57.8855 8.78105C58.3856 9.28115 58.6666 9.95942 58.6666 10.6667V45.3333C58.6666 46.0406 58.3856 46.7189 57.8855 47.219C57.3854 47.7191 56.7072 48 55.9999 48H39.9999C37.8782 48 35.8434 48.8429 34.3431 50.3431C32.8428 51.8434 31.9999 53.8783 31.9999 56C31.9999 53.8783 31.1571 51.8434 29.6568 50.3431C28.1565 48.8429 26.1216 48 23.9999 48H7.99992Z" stroke="#6A7282" stroke-width="5.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </button>

            <div className={styles.InformationBox}>
                <button className={styles.titleBox}>
                    <h3 className={styles.title}>Title</h3>
                    <p className={styles.author}>Author</p>
                </button>

            </div>
        </div>
        </>
    );
}
export default BookCard;