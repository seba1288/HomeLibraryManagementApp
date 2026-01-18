import styles from "./Navigation.module.css";

type NavigationProps = {
  onAddBookClick: () => void;
};

function Navigation({ onAddBookClick }: NavigationProps) {

    return (
        <>
        <div className={styles.navigationBar}>
            <div className={styles.buttonsContainer}>
                <button className={styles.button1}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.icon1}>
                        <path d="M10 5.83334V17.5" stroke="#7C86FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2.50008 15C2.27907 15 2.06711 14.9122 1.91083 14.7559C1.75455 14.5996 1.66675 14.3877 1.66675 14.1667V3.33333C1.66675 3.11232 1.75455 2.90036 1.91083 2.74408C2.06711 2.5878 2.27907 2.5 2.50008 2.5H6.66675C7.5508 2.5 8.39865 2.85119 9.02377 3.47631C9.64889 4.10143 10.0001 4.94928 10.0001 5.83333C10.0001 4.94928 10.3513 4.10143 10.9764 3.47631C11.6015 2.85119 12.4494 2.5 13.3334 2.5H17.5001C17.7211 2.5 17.9331 2.5878 18.0893 2.74408C18.2456 2.90036 18.3334 3.11232 18.3334 3.33333V14.1667C18.3334 14.3877 18.2456 14.5996 18.0893 14.7559C17.9331 14.9122 17.7211 15 17.5001 15H12.5001C11.837 15 11.2012 15.2634 10.7323 15.7322C10.2635 16.2011 10.0001 16.837 10.0001 17.5C10.0001 16.837 9.73669 16.2011 9.26785 15.7322C8.79901 15.2634 8.16312 15 7.50008 15H2.50008Z" stroke="#7C86FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    <span className={styles.button1text}>My Library</span>
                </button>
                <button className={styles.button2} onClick={onAddBookClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.icon2}>
                        <path d="M4.16675 10H15.8334" stroke="#99A1AF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 4.16666V15.8333" stroke="#99A1AF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span className={styles.button2text}>Add Book</span>
                </button>
                <button className={styles.button3}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.icon3}>
                        <path d="M2.5 2.5V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H17.5" stroke="#99A1AF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15 14.1667V7.5" stroke="#99A1AF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.8333 14.1667V4.16666" stroke="#99A1AF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.66675 14.1667V11.6667" stroke="#99A1AF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span className={styles.button2text}>Statistics</span>
                </button>
            </div>
        </div>
        </>
    );
}

export default Navigation;