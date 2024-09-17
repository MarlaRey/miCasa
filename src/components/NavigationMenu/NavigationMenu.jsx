// src/components/NavigationMenu/NavigationMenu.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavigationMenu.module.scss'; // Importér de relevante stilarter
import { AuthContext } from '../../providers/AuthContext'; // Importér AuthContext
import SearchBar from '../SearchBar/SearchBar';

const NavigationMenu = () => {
  const { isLoggedIn } = useContext(AuthContext); // Hent autentificeringsstatus

  return (
    <nav className={styles.nav}>
      <ul className={styles.menu}>
        <li><Link to="/" className={styles.menuItem}>Forside</Link></li>
        <li><Link to="/boliger" className={styles.menuItem}>Boliger</Link></li>
        <li><Link to="/kontakt" className={styles.menuItem}>Kontakt</Link></li>
        {isLoggedIn ? (
          <li><Link to="/minside" className={styles.menuItem}>Min Side</Link></li>
        ) : (
          <li><Link to="/login" className={styles.menuItem}>Login</Link></li>
        )}
      </ul>
      <SearchBar />
    </nav>
  );
};

export default NavigationMenu;
