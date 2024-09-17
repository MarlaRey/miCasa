import { useState, useEffect } from 'react';
import supabase from '../../../supabase'; // Sørg for at opdatere stien, hvis nødvendigt

const useFetchEstates = (limit = 100, sortOption = 'price', filterType = '') => {
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstates = async () => {
      try {
        let query = supabase
          .from('estates')
          .select(`
            id,
            address,
            price,
            floor_space,
            energy_label_id,
            city_id,
            estate_image_rel(image_id, images(image_url)),
            cities(name)
          `)
          .order(sortOption, { ascending: true })
          .limit(limit);

        if (filterType) {
          query = query.eq('property_type', filterType);
        }

        const { data, error } = await query;

        if (error) throw error;

        const estatesWithImages = data.map(estate => {
          const primaryImage = estate.estate_image_rel.find(rel => rel.images?.image_url);
          return {
            ...estate,
            image_url: primaryImage ? primaryImage.images.image_url : 'src/assets/img/slideshow/slide-5.jpg',
            city: estate.cities?.name
          };
        });

        setEstates(estatesWithImages);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstates();
  }, [limit, sortOption, filterType]);

  return { estates, loading, error };
};

export default useFetchEstates;
