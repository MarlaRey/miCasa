import React, { useEffect, useState, useCallback } from 'react';
import { useContext } from 'react';
import supabase from '../../supabase';
import styles from './Home.module.scss';
import SliderGallery from '../components/Home_SliderGallery/SliderGallery';
import EstateSection from '../components/Home_EstateSection/EstateSection';
import FormModal from '../components/FormModal/FormModal';
import { AuthContext } from '../providers/AuthContext'; // Adjust the import path as needed

const Home = () => {
  const { user } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [reviewData, setReviewData] = useState({
    title: '',
    content: '',
    num_stars: '',
    estate_id: ''
  });

  useEffect(() => {
    setIsVisible(true);

    const loadReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error loading reviews:', error);
      } else {
        setReviews(data);
        if (data.length > 0) {
          const randomReview = data[Math.floor(Math.random() * data.length)];
          setCurrentReview(randomReview);
        }
      }
    };

    loadReviews();
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
      const { data: updatedReviews, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_active', true);
      if (fetchError) {
        console.error('Error fetching updated reviews:', fetchError);
      } else {
        setReviews(updatedReviews);
        if (updatedReviews.length > 0) {
          const randomReview = updatedReviews[Math.floor(Math.random() * updatedReviews.length)];
          setCurrentReview(randomReview);
        }
      }
    }
  }, [user, reviewData]);

  const handleWriteReviewClick = useCallback(() => {
    if (!user) {
      alert('Du skal være logget ind for at skrive en anmeldelse.');
      return;
    }
    setIsFormVisible(true);
  }, [user]);

  return (
    <div className={`${styles.home} ${isVisible ? styles.homeVisible : ''}`}>
      <section className={styles.gallerySection}>
        <SliderGallery />
      </section>

      <section className={styles.estatesSection}>
        <EstateSection isHome={true} />
      </section>

      <section className={styles.reviewsSection}>
        <h2>Det siger vores kunder</h2>
        <div className={styles.reviewContainer}>
          {currentReview ? (
            <div>
              <p><strong>{currentReview.title}</strong></p>
              <p>{currentReview.content}</p>
              <p>⭐ {currentReview.num_stars}</p>
            </div>
          ) : (
            <p>Der er endnu ikke givet nogle anmeldelser.</p>
          )}
          <button
            className={styles.writeReviewButton}
            onClick={handleWriteReviewClick}
          >
            Skriv en anmeldelse
          </button>
        </div>
      </section>

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
