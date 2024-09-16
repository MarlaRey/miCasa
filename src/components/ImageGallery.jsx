import React from 'react';
import styles from './ImageGallery.module.scss'; // Brug dine styles

const ImageGallery = ({ images }) => {
  return (
    <div className={styles.gallery}>
      {images && images.length > 0 ? (
        images.map((image, index) => (
          <div key={index} className={styles.imageContainer}>
            <img 
              src={image.image_url ? image.image_url : 'default_image.jpg'} 
              alt={`Gallery image ${index + 1}`} 
              className={styles.image}
            />
          </div>
        ))
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

export default ImageGallery;
