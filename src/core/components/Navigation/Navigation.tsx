import styles from "./Navigation.module.css";

type NavigationProps = {
  onAddBookClick: () => void;
  currentView: 'library' | 'shelves' | 'recommendations' | 'import-export';
  onViewChange: (view: 'library' | 'shelves' | 'recommendations' | 'import-export') => void;
};

function Navigation({ onAddBookClick, currentView, onViewChange }: NavigationProps) {

    return (
        <>
        <div className={styles.navigationBar}>
            <div className={styles.buttonsContainer}>
                <button 
                    className={currentView === 'library' ? styles.button1 : styles.button2} 
                    onClick={() => onViewChange('library')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={currentView === 'library' ? styles.icon1 : styles.icon2}>
                        <path d="M10 5.83334V17.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.50008 15C2.27907 15 2.06711 14.9122 1.91083 14.7559C1.75455 14.5996 1.66675 14.3877 1.66675 14.1667V3.33333C1.66675 3.11232 1.75455 2.90036 1.91083 2.74408C2.06711 2.5878 2.27907 2.5 2.50008 2.5H6.66675C7.5508 2.5 8.39865 2.85119 9.02377 3.47631C9.64889 4.10143 10.0001 4.94928 10.0001 5.83333C10.0001 4.94928 10.3513 4.10143 10.9764 3.47631C11.6015 2.85119 12.4494 2.5 13.3334 2.5H17.5001C17.7211 2.5 17.9331 2.5878 18.0893 2.74408C18.2456 2.90036 18.3334 3.11232 18.3334 3.33333V14.1667C18.3334 14.3877 18.2456 14.5996 18.0893 14.7559C17.9331 14.9122 17.7211 15 17.5001 15H12.5001C11.837 15 11.2012 15.2634 10.7323 15.7322C10.2635 16.2011 10.0001 16.837 10.0001 17.5C10.0001 16.837 9.73669 16.2011 9.26785 15.7322C8.79901 15.2634 8.16312 15 7.50008 15H2.50008Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={currentView === 'library' ? styles.button1text : styles.button2text}>My Library</span>
                </button>
                <button 
                    className={currentView === 'shelves' ? styles.button1 : styles.button2} 
                    onClick={() => onViewChange('shelves')}
                >
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={currentView === 'shelves' ? styles.icon1 : styles.icon2}>
                        <path d="M10 2.5L2.5 6.66667V17.5L10 13.3333L17.5 17.5V6.66667L10 2.5Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={currentView === 'shelves' ? styles.button1text : styles.button2text}>Shelves</span>
                </button>
                <button 
                    className={currentView === 'recommendations' ? styles.button1 : styles.button2} 
                    onClick={() => onViewChange('recommendations')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={currentView === 'recommendations' ? styles.icon1 : styles.icon2}>
                        <path d="M10 2.5L5.83333 17.5L10 14.1667L14.1667 17.5L10 2.5Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 2.5L17.5 5.83333V9.16667C17.5 13.3333 14.1667 16.6667 10 17.5C5.83333 16.6667 2.5 13.3333 2.5 9.16667V5.83333L10 2.5Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                    </svg>
                    <span className={currentView === 'recommendations' ? styles.button1text : styles.button2text}>Recommendations</span>
                </button>
                <button 
                    className={currentView === 'import-export' ? styles.button1 : styles.button2} 
                    onClick={() => onViewChange('import-export')}
                >
                    <span className={currentView === 'import-export' ? styles.button1text : styles.button2text}>Import/Export</span>
                </button>
                <button className={styles.button2} onClick={onAddBookClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.icon2}>
                        <path d="M4.16675 10H15.8334" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 4.16666V15.8333" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={styles.button2text}>Add Book</span>
                </button>
            </div>
        </div>
        </>
    );
}

export default Navigation;