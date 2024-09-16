import React from 'react';
import styles from './SearchBar.module.scss'; 

const SearchBar = () => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Indtast søgeord"
        className={styles.searchInput}
      />
      <button className={styles.searchButton}>
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
