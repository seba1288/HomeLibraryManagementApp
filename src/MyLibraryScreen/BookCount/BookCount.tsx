import styles from "./BookCount.module.css";
 

function MyLibraryScreen() {

    return (
        <>
        <div className={styles.bookCountBar}>
            <div className={styles.CountBox}>
                <div className={styles.CountTitleBox}>
                    <p className={styles.CountText}>Total Books</p>
                </div>
                <div className={styles.CountNumberBox}>
                    <p className={styles.CountNumber}>1</p>
                </div>
            </div>
        

            <div className={styles.CountBox}>
                <div className={styles.CountTitleBox}>
                    <p className={styles.CountText}>Currently Reading</p>
                </div>
                <div className={styles.CountNumberBox}>
                    <p className={styles.CountNumber}>1</p>
                </div>
            </div>
        
         
            <div className={styles.CountBox}>
                <div className={styles.CountTitleBox}>
                    <p className={styles.CountText}>Completed</p>
                </div>
                <div className={styles.CountNumberBox}>
                    <p className={styles.CountNumber}>1</p>
                </div>
            </div>
        </div>
        </>
    );
}

export default MyLibraryScreen;