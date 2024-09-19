import { useState, useEffect } from 'react';
import supabase from '../../../supabase';

const useFetchEstates = (limit = 1000, sortOption = 'created_at', filterType = '') => {
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstates = async () => {
      try {
        setLoading(true);

        // Grundforespørgsel med relationer til cities, estate_types og energy_labels
        let query = supabase
          .from('estates')
          .select(`
            id, address, price, num_rooms, floor_space, city_id, type_id, energy_label_id,
            cities ( name, zipcode ), 
            estate_types ( name ), 
            energy_labels ( letter, color ),
            estate_image_rel ( 
              image_id, 
              images ( image_url )
            )
          `)
          .limit(limit);

        // Filtrer efter ejendomstype, hvis angivet
        if (filterType) {
          query = query.eq('type_id', filterType);
        }

        // Sortering baseret på valgt option
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

        const { data, error } = await query;

        if (error) throw error;

        // Tilføj data fra relationstabellerne til hver ejendom
        const estatesWithDetails = data.map((estate) => {
          // Hent det primære billede fra relationstabellen
          const primaryImage = estate.estate_image_rel?.[0]?.images?.image_url || 'src/assets/img/slideshow/slide-5.jpg';

          return {
            ...estate,
            city_name: estate.cities?.name, // Tilføj bynavnet
            city_zipcode: estate.cities?.zipcode, // Tilføj bynavnet
            estate_type_name: estate.estate_types?.name, // Tilføj ejendomstype
            energy_label_letter: estate.energy_labels?.letter, // Tilføj energimærkning
            energy_label_color: estate.energy_labels?.color, // Tilføj energimærkning
            image_url: primaryImage, // Standardbillede, hvis intet billede er knyttet
          };
        });

        setEstates(estatesWithDetails);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEstates();
  }, [limit, sortOption, filterType]);

  return { estates, loading, error };
};

export default useFetchEstates;
