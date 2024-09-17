import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './PageLayout.module.scss';

const PageLayout = ({ children, user, setUser }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Når komponenten mountes, start fade-in transition
    setIsVisible(true);
  }, []);

  return (
    <div className={`${styles.pageLayout} ${isVisible ? styles.pageLayoutVisible : ''}`}>
      {/* Eksempel på prop-drilling */}
      <Header user={user} setUser={setUser} />

      <main className={styles.main}>
        {children} {/* Indholdet skifter her alt efter hvilken side du er på */}
      </main>

      <Footer className={styles.footer} />
    </div>
  );
};

export default PageLayout;
