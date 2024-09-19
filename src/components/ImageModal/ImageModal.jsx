import React, { useState } from 'react';
import styles from './ImageModal.module.scss'; // CSS-modul for modal-styling

const ImageModal = ({ isOpen, onClose, images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0] || '');

    if (!isOpen) return null;
  
    const handleThumbnailClick = (image) => {
      setSelectedImage(image);
    };
  
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <div className={styles.mainImage}>
            <img src={selectedImage} alt="Selected" />
          </div>
          <div className={styles.thumbnailContainer}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={styles.thumbnail}
                onClick={() => handleThumbnailClick(image)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

export default ImageModal;
