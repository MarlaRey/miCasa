import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './BurgerMenu.module.scss';
import { AuthContext } from '../../providers/AuthContext';

const BurgerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const { isLoggedIn } = useContext(AuthContext); // Hent autentificeringsstatus

  return (
    <div className={styles.burgerMenu}>
      <div className={styles.icon} onClick={toggleMenu}>
        <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
        <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
        <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
      </div>

      {isMenuOpen && (
        <nav className={styles.menu}>
          <ul>
            <li><Link to="/" onClick={closeMenu}>Forside</Link></li>
            <li><Link to="/boliger" onClick={closeMenu}>Boliger</Link></li>
            <li><Link to="/kontakt" onClick={closeMenu}>Kontakt</Link></li>
            {isLoggedIn ? (
              <li><Link to="/minside" onClick={closeMenu} className={styles.menuItem}>Min Side</Link></li>
            ) : (
              <li><Link to="/login" onClick={closeMenu} className={styles.menuItem}>Login</Link></li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default BurgerMenu;
