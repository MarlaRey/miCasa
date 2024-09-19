import React, { useState, useEffect } from 'react';
import useFetchEstates from '../components/Fetches/useFetchEstates'; // Custom hook til at hente boliger 
import EstateCard from '../components/Home_EstateCard/EstateCard'; // Komponent til at vise cards
import styles from './EstateList.module.scss'; // SCSS-modul for styling af EstateList-komponenten
import supabase from '../../supabase'; // Importerer Supabase-klienten for at tilgå databasen

const EstateList = () => {
  // State til at holde styr på sorteringsvalg, filtertype og ejendomstyper
  const [sortOption, setSortOption] = useState('price_asc'); // State for sorteringsindstilling, initialiseret som 'price_asc'
  const [filterType, setFilterType] = useState(''); // State for filtervalg, initialiseret som tom streng (ingen filter)
  const [estateTypes, setEstateTypes] = useState([]); // State for at gemme de forskellige ejendomstyper til filter

  // Henter boliger fra custom hook med de nuværende sorterings- og filtervalg
  const { estates, loading, error } = useFetchEstates(100, sortOption, filterType); // Bruger custom hook til at hente op til 100 boliger

  // useEffect hook til at hente ejendomstyper (til filterdropdown)
  useEffect(() => {
    const fetchEstateTypes = async () => {
      // Henter ejendomstyper fra 'estate_types' tabellen
      const { data, error } = await supabase.from('estate_types').select('*');
      if (error) {
        console.error('Error fetching estate types:', error); // Logger fejl, hvis der opstår en fejl ved hentning af data
      } else {
        setEstateTypes(data); // Opdaterer state med de hentede ejendomstyper
      }
    };

    fetchEstateTypes(); // Kald funktionen for at hente ejendomstyper ved komponentens første rendering
  }, []); // [] betyder, at useEffect kun kører én gang ved komponentens første rendering

  // Viser loading-tekst hvis data er under indlæsning
  if (loading) return <p>Loading estates...</p>;
  
  // Viser fejlbesked hvis der opstår en fejl under hentning af data
  if (error) return <p>Error loading estates: {error.message}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.filters}> 
        {/* Dropdown til sortering af boliger */}
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="price_asc">Pris - stigende</option>
          <option value="price_desc">Pris - faldende</option>
          <option value="floor_space">Antal m2</option>
          <option value="created_at_desc">Liggetid - faldende</option>
        </select>
        {/* Dropdown til filtrering af ejendomstyper */}
        <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
          <option value="">Vælg type</option>
          {estateTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      <section className={styles.section}> {/* Sektion til at vise boligerne */}
        {estates.length === 0 ? ( // Hvis der ingen boliger er, vises en besked
          <p>Vi beklager, men vi har ikke noget der matcher din søgning</p>
        ) : (
          // Mapper over boligerne og viser et card for hver bolig
          estates.map((estate) => (
            <EstateCard key={estate.id} estate={estate} isHome={false} /> // Hver bolig vises som et 'EstateCard' komponent
          ))
        )}
      </section>
    </div>
  );
};

export default EstateList; 
