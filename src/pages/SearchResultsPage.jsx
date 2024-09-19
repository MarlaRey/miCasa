import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EstateCard from '../components/Home_EstateCard/EstateCard';
import styles from './SearchResultPage.module.scss';
import supabase from '../../supabase';

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || ''; // Hent søgeordet fra URL'en

  const [filteredEstates, setFilteredEstates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredEstates = async () => {
      setLoading(true);
      // Søg i databasen efter boliger der matcher søgeordet
      const { data, error } = await supabase
        .from('estates')
        .select('*')
        .ilike('description', `%${searchQuery}%`); // Bruger ilike for case-insensitiv søgning

      if (error) {
        console.error('Error fetching estates:', error);
        setFilteredEstates([]);
      } else {
        setFilteredEstates(data);
      }
      setLoading(false);
    };

    if (searchQuery) {
      fetchFilteredEstates(); // Kald søgefunktionen, hvis der er et søgeord
    }
  }, [searchQuery]);

  if (loading) {
    return <p>Loading search results...</p>;
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
