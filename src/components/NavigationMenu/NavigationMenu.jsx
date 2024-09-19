import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './NavigationMenu.module.scss';
import { AuthContext } from '../../providers/AuthContext';
import SearchBar from '../SearchBar/SearchBar';

const NavigationMenu = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`); // Navigerer til en ny rute med søgeordet
    }
  };

  // Scroll til toppen, når ruten ændrer sig
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <nav className={styles.nav}>
      <ul className={styles.menu}>
        <li>
          <Link to="/" className={`${styles.menuItem} ${location.pathname === '/' ? styles.active : ''}`}>
            Forside
          </Link>
        </li>
        <li>
          <Link to="/boliger" className={`${styles.menuItem} ${location.pathname === '/boliger' ? styles.active : ''}`}>
            Boliger
          </Link>
        </li>
        <li>
          <Link to="/kontakt" className={`${styles.menuItem} ${location.pathname === '/kontakt' ? styles.active : ''}`}>
            Kontakt
          </Link>
        </li>
        {isLoggedIn ? (
          <li>
            <Link to="/minside" className={`${styles.menuItem} ${location.pathname === '/minside' ? styles.active : ''}`}>
              Min Side
            </Link>
          </li>
        ) : (
          <li>
            <Link to="/login" className={`${styles.menuItem} ${location.pathname === '/login' ? styles.active : ''}`}>
              Login
            </Link>
          </li>
        )}
      </ul>
      <SearchBar onSearch={handleSearch} />
    </nav>
  );
};

export default NavigationMenu;
