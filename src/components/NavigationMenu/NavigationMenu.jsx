import React, { useContext, useEffect } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Importerer komponenter og hooks fra React Router
import styles from './NavigationMenu.module.scss';
import { AuthContext } from '../../providers/AuthContext'; // Importerer AuthContext for at få adgang til brugerens loginstatus
import SearchBar from '../SearchBar/SearchBar'; // Importerer søgefeltkomponenten

const NavigationMenu = () => {
  // Henter loginstatus fra AuthContext
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation(); // Får adgang til den aktuelle rute
  const navigate = useNavigate(); // Hook til at navigere programmatisk mellem ruter

  // Funktion til at håndtere søgning. query refererer til den søgestreng, som brugeren indtaster i søgefeltet. 
  const handleSearch = (query) => {
    if (query) {
      // Navigerer til søgesiden med det indtastede søgeord, der er URL-kodet
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  // useEffect hook til at scrolle til toppen af siden, når ruten ændres
  useEffect(() => {
    window.scrollTo(0, 0); // Sætter scrollpositionen til toppen af vinduet
  }, [location.pathname]); // Kører kun når pathname ændres

  return (
    <nav className={styles.nav}> 
      <ul className={styles.menu}>
        <li>
          {/* Link til forsiden med betinget styling for aktiv rute */}
          <Link to="/" className={`${styles.menuItem} ${location.pathname === '/' ? styles.active : ''}`}>
            Forside
          </Link>
        </li>
        <li>
          {/* Link til boliger med betinget styling */}
          <Link to="/boliger" className={`${styles.menuItem} ${location.pathname === '/boliger' ? styles.active : ''}`}>
            Boliger
          </Link>
        </li>
        <li>
          {/* Link til kontaktsiden med betinget styling */}
          <Link to="/kontakt" className={`${styles.menuItem} ${location.pathname === '/kontakt' ? styles.active : ''}`}>
            Kontakt
          </Link>
        </li>
        {/* Betinget rendering baseret på loginstatus */}
        {isLoggedIn ? (
          <li>
            {/* Link til brugerens side, hvis de er logget ind */}
            <Link to="/minside" className={`${styles.menuItem} ${location.pathname === '/minside' ? styles.active : ''}`}>
              Min Side
            </Link>
          </li>
        ) : (
          <li>
            {/* Link til login, hvis brugeren ikke er logget ind */}
            <Link to="/login" className={`${styles.menuItem} ${location.pathname === '/login' ? styles.active : ''}`}>
              Login
            </Link>
          </li>
        )}
      </ul>
      {/* Søgefeltet, der bruger handleSearch-funktionen */}
      <SearchBar onSearch={handleSearch} />
    </nav>
  );
};

export default NavigationMenu;
