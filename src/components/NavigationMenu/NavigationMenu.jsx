import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavigationMenu.module.scss'; // Importér de relevante stilarter
import { AuthContext } from '../../providers/AuthContext'; // Importér AuthContext
import SearchBar from '../SearchBar/SearchBar';

const NavigationMenu = () => {
  const { isLoggedIn } = useContext(AuthContext); // Hent autentificeringsstatus
  const location = useLocation(); // Bruges til at få den aktuelle rute

  return (
    <nav className={styles.nav}>
      <ul className={styles.menu}>
        <li>
          <Link 
            to="/" 
            className={`${styles.menuItem} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Forside
          </Link>
        </li>
        <li>
          <Link 
            to="/boliger" 
            className={`${styles.menuItem} ${location.pathname === '/boliger' ? styles.active : ''}`}
          >
            Boliger
          </Link>
        </li>
        <li>
          <Link 
            to="/kontakt" 
            className={`${styles.menuItem} ${location.pathname === '/kontakt' ? styles.active : ''}`}
          >
            Kontakt
          </Link>
        </li>
        {isLoggedIn ? (
          <li>
            <Link 
              to="/minside" 
              className={`${styles.menuItem} ${location.pathname === '/minside' ? styles.active : ''}`}
            >
              Min Side
            </Link>
          </li>
        ) : (
          <li>
            <Link 
              to="/login" 
              className={`${styles.menuItem} ${location.pathname === '/login' ? styles.active : ''}`}
            >
              Login
            </Link>
          </li>
        )}
      </ul>
      <SearchBar />
    </nav>
  );
};

export default NavigationMenu;
