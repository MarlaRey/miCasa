import React, { useState } from 'react';
import styles from './SearchBar.module.scss'; 

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery); // Sender søgeordet tilbage til den overordnede komponent
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Indtast søgeord"
        className={styles.searchInput}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Opdaterer state med brugerinput
      />
      <button className={styles.searchButton} onClick={handleSearch}>
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
