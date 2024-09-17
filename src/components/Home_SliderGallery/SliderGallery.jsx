import React, { useState, useEffect } from 'react';
import styles from './SliderGallery.module.scss'; // Importér dine stilarter

const SliderGallery = () => {
  const images = import.meta.glob('../../assets/img/slideshow/*.jpg', { eager: true });

  const imageArray = Object.values(images).map((image) => image.default);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1));
    }, 5000); // Skift billede hver 5. sekund

    return () => clearInterval(interval); // Ryd intervallet ved unmount
  }, [imageArray.length]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className={styles.slider}>
      <div className={styles.sliderImage}>
        {imageArray.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={index === currentIndex ? styles.active : styles.inactive}
          />
        ))}
      </div>
      <button className={styles.prevButton} onClick={handlePrevClick}>
        &lt;
      </button>
      <button className={styles.nextButton} onClick={handleNextClick}>
        &gt;
      </button>
    </div>
  );
};

export default SliderGallery;
