import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import SliderGallery from '../components/Home_SliderGallery/SliderGallery';
import EstateSection from '../components/Home_EstateSection/EstateSection';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`${styles.home} ${isVisible ? styles.homeVisible : ''}`}>
      <section className={styles.gallerySection}>
        <SliderGallery />
      </section>

      <section className={styles.estatesSection}>
        <EstateSection isHome={true}/> {/* Brug isHome og limit props */}
      </section>
    </div>
  );
};

export default Home;
