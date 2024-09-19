import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EstateCard from '../components/Home_EstateCard/EstateCard';
import styles from './SearchResultPage.module.scss';
import useFetchEstates from '../components/Fetches/useFetchEstates'; // Custom hook til at hente boliger 

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || ''; // Hent søgeordet fra URL'en

  const { estates, loading, error } = useFetchEstates(); // Kald custom hook korrekt
  const [filteredEstates, setFilteredEstates] = useState([]);

  useEffect(() => {
    // Filtrer ejendommene baseret på søgeordet og flere felter
    if (estates) {
      const filtered = estates.filter((estate) =>
        estate.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        estate.city_name?.toLowerCase().includes(searchQuery.toLowerCase()) || // Søg i bynavn
        estate.estate_type_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||// Søg i ejendomstype
        estate.description?.toLowerCase().includes(searchQuery.toLowerCase()) // Søg i ejendomstype
      );
      setFilteredEstates(filtered);
    }
  }, [searchQuery, estates]); // Opdater filtreringen når søgeordet eller ejendommene ændres

  if (loading) {
    return <p>Loading search results...</p>;
  }

  if (error) {
    return <p>Der opstod en fejl: {error}</p>;
  }

  if (filteredEstates.length === 0) {
    return <p>Ingen boliger matcher søgeordet "{searchQuery}".</p>;
  }

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        {filteredEstates.map((estate) => (
          <EstateCard key={estate.id} estate={estate} isHome={false} />
        ))}
      </section>
    </div>
  );
};

export default SearchResultsPage;
