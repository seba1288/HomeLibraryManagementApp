import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import styles from "./BookCount.module.css";

function MyLibraryScreen() {
    const [counts, setCounts] = useState({
        total: 0,
        reading: 0,
        completed: 0
    });

    useEffect(() => {
        const fetchCounts = async () => {
            // Fetch total books
            const { count: totalCount } = await supabase
                .from('books')
                .select('*', { count: 'exact', head: true });

            // Fetch currently reading
            const { count: readingCount } = await supabase
                .from('books')
                .select('*', { count: 'exact', head: true })
                .eq('reading_status', 'reading');

            // Fetch completed
            const { count: completedCount } = await supabase
                .from('books')
                .select('*', { count: 'exact', head: true })
                .eq('reading_status', 'completed');

            setCounts({
                total: totalCount || 0,
                reading: readingCount || 0,
                completed: completedCount || 0
            });
        };

        fetchCounts();
    }, []);

    return (
        <>
        <div className={styles.bookCountBar}>
            <div className={styles.CountBox}>
                <div className={styles.CountTitleBox}>
                    <p className={styles.CountText}>Total Books</p>
                </div>
                <div className={styles.CountNumberBox}>
                    <p className={styles.CountNumber}>{counts.total}</p>
                </div>
            </div>
        

            <div className={styles.CountBox}>
                <div className={styles.CountTitleBox}>
                    <p className={styles.CountText}>Currently Reading</p>
                </div>
                <div className={styles.CountNumberBox}>
                    <p className={styles.CountNumber}>{counts.reading}</p>
                </div>
            </div>
        
         
            <div className={styles.CountBox}>
                <div className={styles.CountTitleBox}>
                    <p className={styles.CountText}>Completed</p>
                </div>
                <div className={styles.CountNumberBox}>
                    <p className={styles.CountNumber}>{counts.completed}</p>
                </div>
            </div>
        </div>
        </>
    );
}

export default MyLibraryScreen;