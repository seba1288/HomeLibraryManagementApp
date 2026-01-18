import style from './LoginPage.module.css'

function App() {

  return (
    <>
    <div className={style.backgroud}>
        <div className={style.wholeBlock}>
            <div className={style.logo}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" className={style.logoIcon}>
                    <path d="M24 14V42" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 36C5.46957 36 4.96086 35.7893 4.58579 35.4142C4.21071 35.0391 4 34.5304 4 34V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6H16C18.1217 6 20.1566 6.84285 21.6569 8.34315C23.1571 9.84344 24 11.8783 24 14C24 11.8783 24.8429 9.84344 26.3431 8.34315C27.8434 6.84285 29.8783 6 32 6H42C42.5304 6 43.0391 6.21071 43.4142 6.58579C43.7893 6.96086 44 7.46957 44 8V34C44 34.5304 43.7893 35.0391 43.4142 35.4142C43.0391 35.7893 42.5304 36 42 36H30C28.4087 36 26.8826 36.6321 25.7574 37.7574C24.6321 38.8826 24 40.4087 24 42C24 40.4087 23.3679 38.8826 22.2426 37.7574C21.1174 36.6321 19.5913 36 18 36H6Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div className={style.pageTitleBox}>
                <h1 className={style.pageTitle}>Home Library</h1>
            </div>
            <div  className={style.pageTitleTextBox}>
                <p className={style.pageTitleText}>Menage your personal book collection</p>
            </div>

            <div className={style.googleSignInBox} >
                <div className={style.welcomeBox} > 
                    <h1 className={style.welcomeSign}>Welcome</h1>
                </div>
                <div className={style.welcomeTextBox}>
                    <p className={style.welcomeText}>Sign in to access your library</p>
                </div>
                <button className={style.continueWithGoogleButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={style.googleIcon}>
                        <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                        <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13999 18.63 6.70999 16.7 5.83999 14.1H2.17999V16.94C3.98999 20.53 7.69999 23 12 23Z" fill="#34A853"/>
                        <path d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91001V7.07001H2.18C1.43 8.55001 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.03 14.71L5.84 14.09Z" fill="#FBBC05"/>
                        <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.69999 1 3.98999 3.47 2.17999 7.07L5.83999 9.91C6.70999 7.31 9.13999 5.38 12 5.38Z" fill="#EA4335"/>
                    </svg>
                    <span className={style.continueWithGoogleText}>Continue with google</span>
                </button>

                <div className={style.SecutreAuthenticationBox}>
                    <p className={style.SecutreAuthenticationText}>Secure Authenthication</p>
                </div>
                <div className={style.infomationsAboutAppBox}>
                    <div className={style.infomationBox}> 
                        <div className={style.infomationIconCircle}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" className={style.infomationIcon}>
                                <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="#05DF72" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <p className={style.infomationText}>Track your reading progress</p>
                    </div>
                    <div className={style.infomationBox}>
                        <div className={style.infomationIconCircle}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" className={style.infomationIcon}>
                                <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="#05DF72" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>  
                        </div>
                        <p className={style.infomationText}>Organize your books by genre, author, and series</p>
                    </div>
                    <div className={style.infomationBox}>
                        <div className={style.infomationIconCircle}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" className={style.infomationIcon}>
                                <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="#05DF72" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>  
                        </div>
                        <p className={style.infomationText}>view reading statistics and insights</p>
                    </div>

                </div>
            </div>
            <p className={style.dataStorageText}>Your data is stored locally on your device</p>
        </div>
    </div>
    </>
  )
}

export default App
