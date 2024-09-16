import React from 'react';
import styles from './Home.module.scss'; // Importér dine stilarter
import SliderGallery from '../components/SliderGallery';

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Galleriet placeres øverst */}
      <section className={styles.gallerySection}>
        <SliderGallery />
      </section>

      {/* Resten af din side kan du tilføje her */}
      <section className={styles.content}>
        <h1>Velkommen til Hjemmesiden</h1>
        <p>Her kan du finde mere information...</p>
      </section>
    </div>
  );
};

export default Home;
