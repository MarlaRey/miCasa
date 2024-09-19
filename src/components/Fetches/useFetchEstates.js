import { useState, useEffect } from 'react';
import supabase from '../../../supabase'; // Importerer Supabase-klienten for at kunne tilgå databasen

// Custom hook til at hente boliger med filtrering og sortering
const useFetchEstates = (limit = 100, sortOption = 'price_asc', filterType = '') => {
  // State hooks til at håndtere boliger, loading-status og fejl
  const [estates, setEstates] = useState([]); // Initialiserer state for boliger som en tom array
  const [loading, setLoading] = useState(true); // Initialiserer state for loading som true
  const [error, setError] = useState(null); // Initialiserer state for fejl som null

  // useEffect hook til at hente data, når komponenten mountes eller når dependencies ændres
  useEffect(() => {
    // Asynkron funktion til at hente boliger fra Supabase
    const fetchEstates = async () => {
      try {
        // Initial query for at hente data fra 'estates' tabellen
        let query = supabase
          .from('estates')
          .select(`id, address, price, floor_space, energy_label_id, city_id, estate_image_rel(image_id, images(image_url)), cities(name)`)
          .limit(limit); // Begrænser antallet af resultater baseret på 'limit' parameteren

        // Anvend filter hvis filterType ikke er tom
        if (filterType) {
          query = query.eq('type_id', filterType); // Filtrerer resultaterne efter 'type_id'
        }

        // Anvend sortering baseret på sortOption
        switch (sortOption) {
          case 'price_asc':
            query = query.order('price', { ascending: true }); // Sorterer efter pris i stigende rækkefølge
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false }); // Sorterer efter pris i faldende rækkefølge
            break;
          case 'floor_space':
            query = query.order('floor_space', { ascending: false }); // Sorterer efter kvadratmeter i faldende rækkefølge
            break;
          case 'created_at_desc':
            query = query.order('created_at', { ascending: false }); // Sorterer efter oprettelsesdato i faldende rækkefølge
            break;
          default:
            query = query.order('price', { ascending: true }); // Standard sortering: efter pris i stigende rækkefølge
            break;
        }

        // Udfør forespørgslen og håndter resultater
        const { data, error } = await query;

        if (error) throw error; // Kast fejl, hvis der er en

        // Map boligerne til at inkludere et billede og bynavn
        const estatesWithImages = data.map(estate => {
          // Find det primære billede for hver bolig
          const primaryImage = estate.estate_image_rel.find(rel => rel.images?.image_url);
          return {
            ...estate,
            image_url: primaryImage ? primaryImage.images.image_url : 'src/assets/img/slideshow/slide-5.jpg', // Sæt standardbillede hvis ingen findes
            city: estate.cities?.name // Tilføj bynavn
          };
        });

        setEstates(estatesWithImages); // Opdater state med boligerne
      } catch (error) {
        setError(error); // Opdater state med fejl
      } finally {
        setLoading(false); // Indstil loading-status til false uanset om der er fejl eller ej
      }
    };

    fetchEstates(); // Kald funktionen for at hente data

  }, [limit, sortOption, filterType]); // Afhængigheder: Effekt hooken kører igen hvis en af disse ændres

  // Returner boliger, loading-status og fejl
  return { estates, loading, error };
};

export default useFetchEstates; // Eksporter hooken for at kunne bruge den i andre komponenter
