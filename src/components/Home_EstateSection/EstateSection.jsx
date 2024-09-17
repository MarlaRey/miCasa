import React, { useEffect, useState } from 'react';
import supabase from '../../../supabase';
import EstateCard from '../Home_EstateCard/EstateCard'; // Importér kortkomponent
import styles from './EstateSection.module.scss';

const EstateSection = () => {
  const [estates, setEstates] = useState([]);

  useEffect(() => {
    fetchEstates();
  }, []);
  const fetchEstates = async () => {
    try {
      const { data, error } = await supabase
        .from('estates')
        .select(`
          id,
          address,
          price,
          floor_space,
          energy_label_id,
          city_id,
          estate_image_rel(image_id, images(image_url)),
          cities(name)  // Assuming "cities" table has a "name" column for the city
        `)
        .limit(3)
        .order('created_at', { ascending: false });
  
      if (error) throw error;
  
      // Process data to include the image URL
      const estatesWithImages = data.map(estate => {
        // Find the primary image URL
        const primaryImage = estate.estate_image_rel.find(rel => rel.images?.image_url);
        return {
          ...estate,
          image_url: primaryImage ? primaryImage.images.image_url : 'src/assets/img/slideshow/slide-5.jpg', // Fallback image if no primary image
          city: estate.cities?.name // Ensure city name is included if available
        };
      });
  
      setEstates(estatesWithImages);
    } catch (error) {
      console.error('Error fetching estates:', error);
    }
  };
  

  return (
    <section className={styles.section}>
      {estates.map((estate) => (
        <EstateCard key={estate.id} estate={estate} />
      ))}
    </section>
  );
};

export default EstateSection;
