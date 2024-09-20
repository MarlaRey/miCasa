import React, { useState } from 'react';
import styles from './ImageModal.module.scss'; 

// ImageModal-komponenten viser et modalvindue med billeder
const ImageModal = ({ isOpen, onClose, images }) => {
    // State til at holde det valgte billede (initialiseres med det første billede i arrayet)
    const [selectedImage, setSelectedImage] = useState(images[0] || '');

    // Hvis modalvinduet ikke er åbent, vises intet
    if (!isOpen) return null;

    // Funktion til at opdatere det valgte billede, når en thumbnail klikkes
    const handleThumbnailClick = (image) => {
      setSelectedImage(image);
    };

    return (
      // Overlay, der dækker hele skærmen og lukker modalvinduet, når det klikkes
      <div className={styles.overlay} onClick={onClose}>
        {/* Modalvindue, der stopper click-eventet fra at bevæge sig opad i DOM-strukturen til forældreelementer 
        Når der klikkes inde i modalvinduet (den indre div), kaldes e.stopPropagation(). Dette forhindrer, at klikket når den ydre div, hvilket ville lukke modalvinduet. */}
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          {/* Knap til at lukke modalvinduet */}
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <div className={styles.mainImage}>
            {/* Viser det valgte billede */}
            <img src={selectedImage} alt="Selected" />
          </div>
          <div className={styles.thumbnailContainer}>
            {/* Mapper over billederne og viser thumbnails */}
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={styles.thumbnail}
                // Når thumbnail klikkes, opdateres det valgte billede
                onClick={() => handleThumbnailClick(image)}
              />
            ))}
          </div>
        </div>
      </div>
    );
};

export default ImageModal;
