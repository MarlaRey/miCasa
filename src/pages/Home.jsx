import React from 'react';
import styles from './Home.module.scss'; // Importér dine stilarter
import SliderGallery from '../components/Home_SliderGallery/SliderGallery';
import EstateSection from '../components/Home_EstateSection/EstateSection';
import ReviewSection from '../components/Home_ReviewSection/ReviewSection';
import SubmitReview from '../components/Home_ReviewSection/SubmitReview';




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
