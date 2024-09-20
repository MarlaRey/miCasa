import React from 'react';
import useFetchEstates from '../Fetches/useFetchEstates'; 
import EstateCard from '../Home_EstateCard/EstateCard'; 
import styles from './EstateSection.module.scss'; 

const EstateSection = ({ limit = 3, sortOption = 'created_at', filterType = '' }) => {
  const fetchLimit = 1000; // fast antal boliger hentes for forbedrebedre randomisering
  
  const { estates, loading, error } = useFetchEstates(fetchLimit, sortOption, filterType); // Hent 1000 boliger

  if (loading) return <p>Loading estates...</p>; // Hvis data er ved at blive hentet
  if (error) return <p>Error loading estates: {error.message}</p>; // Hvis der opstår fejl

  // Randomiser rækkefølgen og vælg kun det antal boliger, der angives af limit
  const displayEstates = estates.sort(() => 0.5 - Math.random()).slice(0, limit); 

  return (
    <section className={styles.section}> 
      {displayEstates.map((estate) => (
        <EstateCard key={estate.id} estate={estate} isHome={true} />
      ))}
    </section>
  );
};

export default EstateSection; 
