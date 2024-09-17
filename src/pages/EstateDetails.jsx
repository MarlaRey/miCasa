import React, { useEffect, useState } from 'react';
import supabase from '../../supabase';
import Modal from '../components/Modal/Modal';
import styles from './EstateDetail.module.scss';

const EstateDetail = ({ estateId }) => {
  const [estate, setEstate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    fetchEstateDetail();
  }, [estateId]);

  const fetchEstateDetail = async () => {
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
          cities(name),
          clicks
        `)
        .eq('id', estateId)
        .single();

      if (error) throw error;

      const primaryImage = data.estate_image_rel.find(rel => rel.images?.image_url);

      setEstate({
        ...data,
        image_url: primaryImage ? primaryImage.images.image_url : 'src/assets/img/slideshow/slide-5.jpg',
        city: data.cities?.name
      });
    } catch (error) {
      console.error('Error fetching estate detail:', error);
    }
  };

  const handleAddToFavorites = async () => {
    // Logic to add/remove from favorites
  };

  if (!estate) return <div>Loading...</div>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.topSection}>
        <img src={estate.image_url} alt="Estate" className={styles.mainImage} />
        <div className={styles.info}>
          <h1>{estate.address}</h1>
          <p>Price: {estate.price}</p>
          <p>Size: {estate.floor_space}</p>
          <p>Clicks: {estate.clicks}</p>
          <p>Energy Label: {estate.energy_label_id}</p>
          <button onClick={() => setIsModalOpen(true)}>View Gallery</button>
          <button onClick={() => setIsModalOpen(true)}>View Floorplan</button>
          <button onClick={() => setIsModalOpen(true)}>View Map</button>
          <button onClick={handleAddToFavorites}>{favorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        </div>
      </div>
      <div className={styles.detailsSection}>
        {/* Show additional details, text, agent info here */}
      </div>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default EstateDetail;
