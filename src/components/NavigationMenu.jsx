import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavigationMenu.module.scss'; // Importér de relevante stilarter
import SearchBar from './SearchBar';

const NavigationMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);



  return (
    <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
      <ul className={styles.menu}>
        <li><Link to="/" className={styles.menuItem}>Forside</Link></li>
        <li><Link to="/boliger" className={styles.menuItem}>Boliger</Link></li>
        <li><Link to="/kontakt" className={styles.menuItem}>Kontakt</Link></li>
        <li><Link to="/login" className={styles.menuItem}>Login</Link></li>
      </ul>
      <SearchBar />
    </nav>
  );
};

export default NavigationMenu;
