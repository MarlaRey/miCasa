import { useState, useEffect } from 'react';
import supabase from '../../../supabase';
// Custom hook til at hente ejendomsdata fra Supabase med sorterings- og filtreringsmuligheder
const useFetchEstates = (limit = 1000, sortOption = 'created_at', filterType = '') => {
  // State til at gemme ejendomsdata, loading-tilstand og fejlmeddelelser
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Asynkron funktion til at hente ejendomsdata
    const fetchEstates = async () => {
      try {
        // Sætter loading-tilstand til true, før data hentes
        setLoading(true);

       // Grundforespørgsel til Supabase med join på relaterede tabeller
        let query = supabase
          .from('estates')
          .select(`
            id, address, price, num_rooms, floor_space, city_id, type_id, energy_label_id, description,
            cities ( name, zipcode ), 
            estate_types ( name ), 
            energy_labels ( letter, color ),
            estate_image_rel ( 
              image_id, 
              images ( image_url )
            )
          `)
          .limit(limit);

         // Tjekker om der er et filter valgt for ejendomstype, og hvis ja, tilføjer en filterbetingelse
        if (filterType) {
          query = query.eq('type_id', filterType);
        }

       // Switch statement til at håndtere sorteringsmuligheder baseret på 'sortOption'
        switch (sortOption) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'floor_space':
            query = query.order('floor_space', { ascending: false });
            break;
          case 'created_at':
            query = query.order('created_at', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }
        //her venter vi på at promise bliver afviklet
        const { data, error } = await query;

        if (error) throw error;

        // Tilføj data fra relationstabellerne til hver ejendom
        const estatesWithDetails = data.map((estate) => {
          // Hent det primære billede fra relationstabellen
          const primaryImage = estate.estate_image_rel?.[0]?.images?.image_url || 'src/assets/img/slideshow/slide-5.jpg';

          return {
            ...estate,
            city_name: estate.cities?.name, // Tilføj bynavnet
            city_zipcode: estate.cities?.zipcode, //postnummer
            estate_type_name: estate.estate_types?.name, // Tilføj ejendomstype
            energy_label_letter: estate.energy_labels?.letter, // Tilføj energimærkning
            energy_label_color: estate.energy_labels?.color, // min farvetabel
            image_url: primaryImage, // Tilføjer URL'en for det primære billede
          };
        });

        setEstates(estatesWithDetails);// Opdaterer state med de hentede ejendomme og deres detaljer
      } catch (error) {
        setError(error.message);// Hvis en fejl opstår, gemmes fejlbeskeden i 'error' state
      } finally {
        setLoading(false);// Når forespørgslen er færdig (uanset succes eller fejl), sættes loading til false
      }
    };

    fetchEstates();// Kald funktion for at hente ejendomme, når component mountes eller når afhængigheder opdateres
  }, [limit, sortOption, filterType]); // Dependency array: Hooken kører, når 'limit', 'sortOption' eller 'filterType' ændrer sig

  return { estates, loading, error };
};

export default useFetchEstates;
