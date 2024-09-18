import React, { useState, useEffect, useCallback, useContext } from 'react';
import supabase from '../../supabase';
import styles from './Home.module.scss';
import SliderGallery from '../components/Home_SliderGallery/SliderGallery';
import EstateSection from '../components/Home_EstateSection/EstateSection';
import FormModal from '../components/FormModal/FormModal';
import { AuthContext } from '../providers/AuthContext';
import ReviewSection from '../components/Home_ReviewSection/ReviewSection';
import EmployeeSection from '../components/Home_EmployeeSection/EmployeeSection';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [reviewData, setReviewData] = useState({
    title: '',
    content: '',
    num_stars: '',
    estate_id: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleReviewSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Du skal være logget ind for at skrive en anmeldelse.');
      return;
    }

    const { error } = await supabase
      .from('reviews')
      .insert([{
        user_id: user.id,
        estate_id: reviewData.estate_id,
        title: reviewData.title,
        content: reviewData.content,
        num_stars: reviewData.num_stars,
        created_at: new Date().toISOString(),
        is_active: true
      }]);


    if (error) {
      console.error('Error submitting review:', error);
      alert('Der opstod en fejl ved indsendelse af anmeldelsen.');
    } else {
      setReviewData({ title: '', content: '', num_stars: '', estate_id: '' });
      setIsFormVisible(false);
    }
  }, [user, reviewData]);

  return (
    <div className={`${styles.home} ${isVisible ? styles.homeVisible : ''}`}>
      <section className={styles.gallerySection}>
        <SliderGallery />
      </section>

      <section className={styles.estatesSection}>
        <EstateSection isHome={true} />
      </section>

      <ReviewSection />

      <EmployeeSection />

      {user && (
        <FormModal
          isVisible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
          onSubmit={handleReviewSubmit}
          reviewData={reviewData}
          setReviewData={setReviewData}
        />
      )}
    </div>
  );
};

export default Home;
