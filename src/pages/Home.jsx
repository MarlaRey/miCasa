import React from 'react';
import styles from './Home.module.scss'; // Importér dine stilarter
import SliderGallery from '../components/Home_SliderGallery/SliderGallery';
import EstateSection from '../components/Home_EstateSection/EstateSection';

const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.gallerySection}>
        <SliderGallery />
      </section>

      <section className={styles.estatesSection}>
        <EstateSection isHome={true} /> {/* Pass isHome prop */}
      </section>
    </div>
  );
};

export default Home;
