import React from 'react';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import logo from '../assets/img/Logo.png'; // Tilpas stien til logoet
import NavigationMenu from './NavigationMenu';
import BurgerMenu from './BurgerMenu'; // Importér BurgerMenu

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.background}>
        <div className={styles.backgroundTop}></div>
        <div className={styles.backgroundBottom}></div>
      </div>
      <Link to="/" className={styles.logoLink}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </Link>
      <NavigationMenu />
      <BurgerMenu /> 
    </header>
  );
};

export default Header;

