// BurgerMenu.jsx
import React from 'react';
import styles from './BurgerMenu.module.scss';

const BurgerMenu = ({ isMenuOpen, toggleMenu }) => {
  return (
    <div className={styles.burgerMenu} onClick={toggleMenu}>
      <div className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></div>
      <div className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></div>
      <div className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></div>
    </div>
  );
};

export default BurgerMenu;
