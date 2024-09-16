import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from './PageLayout.module.scss';

//her har vi en destructrue assignment i et funktionsparamater. en destructrue assignment er en måde at udpakke værdier fra objekter eller arrays. her bruges det til at udpakke de props fra objektet,der bliver sendt til komponenten.

const PageLayout = ({ children, user, setUser }) => {
    return (
        <div className={styles.pageLayout}>
            {/*her har vi et eksempel på det man kalder prop-drilling, når man sender props fra et overordnet komponent(App) og ned gennem flere lag af komponenter til der hvor de skal bruges*/}
            <Header user={user} setUser={setUser} />
           

                <main className={styles.main}>
                    {children} {/* Indholdet skifter her alt efter hvilken side du er på */}
                </main>

            <Footer className={styles.footer} />
        </div>
    );
};

export default PageLayout;
