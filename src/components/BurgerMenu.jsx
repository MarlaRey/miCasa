import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './BurgerMenu.module.scss';

const BurgerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.burgerMenu}>
      {/* Ikon der skifter mellem tre linjer og et X */}
      <div className={styles.icon} onClick={toggleMenu}>
        <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
        <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
        <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
      </div>

      {/* Menuen som folder sig ud */}
      {isMenuOpen && (
        <nav className={styles.menu}>
          <ul>
            <li><Link to="/" onClick={closeMenu}>Forside</Link></li>
            <li><Link to="/boliger" onClick={closeMenu}>Boliger</Link></li>
            <li><Link to="/kontakt" onClick={closeMenu}>Kontakt</Link></li>
            <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default BurgerMenu;
