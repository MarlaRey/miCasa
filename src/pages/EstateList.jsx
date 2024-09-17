import React, { useEffect, useState } from 'react';
import supabase from '../../supabase';
import EstateCard from '../components/Home_EstateCard/EstateCard'; // Opdater import
import styles from './EstateList.module.scss';

const EstateList = () => {
  const [estates, setEstates] = useState([]);
  const [sortOption, setSortOption] = useState('price');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchEstates();
  }, [sortOption, filterType]);

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
        .limit(100);

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
      console.error('Error fetching estates:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="price">Sort by Price</option>
          <option value="floor_space">Sort by Size</option>
          <option value="created_at">Sort by Age</option>
        </select>
        <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <section className={styles.section}>
        {estates.map((estate) => (
          <EstateCard key={estate.id} estate={estate} isHome={false} />
        ))}
      </section>
    </div>
  );
};

export default EstateList;
