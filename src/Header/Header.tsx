import styles from "./Header.module.css";

function Header() {

    return (
        <>
        <div className={styles.header}>
            <div className={styles.widecontainer}>
                <div className={styles.textcontainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className={styles.icon}>
                    <path d="M16 9.33333V28" stroke="#7C86FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.00008 24C3.64646 24 3.30732 23.8595 3.05727 23.6095C2.80722 23.3594 2.66675 23.0203 2.66675 22.6667V5.33333C2.66675 4.97971 2.80722 4.64057 3.05727 4.39052C3.30732 4.14048 3.64646 4 4.00008 4H10.6667C12.0812 4 13.4378 4.5619 14.438 5.5621C15.4382 6.56229 16.0001 7.91885 16.0001 9.33333C16.0001 7.91885 16.562 6.56229 17.5622 5.5621C18.5624 4.5619 19.9189 4 21.3334 4H28.0001C28.3537 4 28.6928 4.14048 28.9429 4.39052C29.1929 4.64057 29.3334 4.97971 29.3334 5.33333V22.6667C29.3334 23.0203 29.1929 23.3594 28.9429 23.6095C28.6928 23.8595 28.3537 24 28.0001 24H20.0001C18.9392 24 17.9218 24.4214 17.1717 25.1716C16.4215 25.9217 16.0001 26.9391 16.0001 28C16.0001 26.9391 15.5787 25.9217 14.8285 25.1716C14.0784 24.4214 13.0609 24 12.0001 24H4.00008Z" stroke="#7C86FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p className={styles.headerTitle}>Home Library</p>
                </div>
            </div>
        </div>
        </>
    );
}

export default Header;