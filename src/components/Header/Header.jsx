import React, { useContext } from 'react';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/Logo.png'; // Tilpas stien til logoet
import NavigationMenu from '../NavigationMenu/NavigationMenu';
import BurgerMenu from '../BurgerMenu/BurgerMenu'; 
import { AuthContext } from '../../providers/AuthContext'; // Importér AuthContext

const Header = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext); // Hent brugeroplysninger fra AuthContext

  return (
    <header className={styles.header}>
      {isLoggedIn && user && ( // Tjek om brugeren er logget ind og brugeren eksisterer
        <nav className={styles.userInfo}>
          <div className={styles.userLog}>
            <span className={styles.username}><p>Du er logget ind som {user.email}</p></span> 
            <button onClick={logout} className={styles.logoutButton}>Logout</button>
          </div>
        </nav>
      )}
      
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
