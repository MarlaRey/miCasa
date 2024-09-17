import React from 'react';
import useFetchEstates from '../Fetches/useFetchEstates'; // Opdater stien hvis nødvendigt
import EstateCard from '../Home_EstateCard/EstateCard'; // Importér kortkomponent
import styles from './EstateSection.module.scss';

const EstateSection = ({ isHome, limit = 3, sortOption = 'created_at', filterType = '' }) => {
  // Hent et større antal estates end det ønskede limit
  const { estates, loading, error } = useFetchEstates(limit * 25, sortOption, filterType); // Hent dobbelt så mange estates

  if (loading) return <p>Loading estates...</p>;
  if (error) return <p>Error loading estates: {error.message}</p>;

  // Hvis vi er på forsiden og isHome er true, vælg tilfældige estates
  const displayEstates = isHome
    ? estates.sort(() => 0.5 - Math.random()).slice(0, limit) // Vælg tilfældige estates
    : estates.slice(0, limit); // Vis første 'limit' estates hvis ikke på forsiden

  return (
    <section className={styles.section}>
      {displayEstates.map((estate) => (
        <EstateCard key={estate.id} estate={estate} isHome={isHome} />
      ))}
    </section>
  );
};

export default EstateSection;
