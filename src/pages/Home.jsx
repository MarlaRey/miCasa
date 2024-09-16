import React from 'react';
import styles from './Home.module.scss'; // Importér dine stilarter
import SliderGallery from '../components/SliderGallery';
import EstateSection from '../components/EstateSection';




const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.gallerySection}>
        <SliderGallery />
      </section>

      <section className={styles.EstateSection}> <EstateSection /></section>





    </div>
  );
};

export default Home;
