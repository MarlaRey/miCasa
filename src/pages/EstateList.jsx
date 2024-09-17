import React, { useState } from 'react';
import useFetchEstates from '../components/Fetches/useFetchEstates'; // Opdater stien hvis nødvendigt
import EstateCard from '../components/Home_EstateCard/EstateCard';
import styles from './EstateList.module.scss';

const EstateList = () => {
  const [sortOption, setSortOption] = useState('price');
  const [filterType, setFilterType] = useState('');
  
  const { estates, loading, error } = useFetchEstates(100, sortOption, filterType); // Henter op til 100 boliger

  if (loading) return <p>Loading estates...</p>;
  if (error) return <p>Error loading estates: {error.message}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="price">Sort by Price</option>
          <option value="floor_space">Sort by Size</option>
          <option value="created_at">Sort by Age</option>
        </select>
        <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
        </select>
      </div>
      <section className={styles.section}>
        {estates.map((estate) => (
          <EstateCard key={estate.id} estate={estate} isHome={false} />
        ))}
      </section>
    </div>
  );
};

export default EstateList;
