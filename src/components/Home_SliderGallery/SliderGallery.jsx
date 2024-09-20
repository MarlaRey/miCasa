import React, { useState, useEffect } from 'react';
import styles from './SliderGallery.module.scss'; 

const SliderGallery = () => {
  const images = import.meta.glob('../../assets/img/slideshow/*.jpg', { eager: true }); //import.meta.glob bruges til at dynamisk importere alle JPG-billeder fra en specifik mappe. 
  //{ eager: true } betyder, at alle billederne bliver importeret med det samme, så de er tilgængelige med det samme, i stedet for at blive indlæst asynkront.

  const imageArray = Object.values(images).map((image) => image.default); //Her konverteres de importerede billeder fra et objekt til et array, hvor image.default refererer til den faktiske billed-URL.
  const [currentIndex, setCurrentIndex] = useState(0); //holder styr på, hvilket billede der vises i slideren.

  useEffect(() => { //useEffect bruges til at sætte et interval, der automatisk skifter til det næste billede hver 5. sekund.
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1));
    }, 5000); // Skift billede hver 5. sekund

    return () => clearInterval(interval); // Ryd intervallet ved unmount
  }, [imageArray.length]);

  //funktioner der ændrer currentIndex for at vise det forrige eller næste billede. De håndterer også cirkulær navigation, hvor det første billede kan gå til det sidste og vice versa.
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
