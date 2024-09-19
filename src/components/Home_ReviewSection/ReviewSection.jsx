import React, { useState, useEffect, useContext, useCallback } from 'react';
import supabase from '../../../supabase';
import styles from './ReviewSection.module.scss';
import { AuthContext } from '../../providers/AuthContext';
import FormModal from '../FormModal/FormModal'; // Importér din formular-komponent

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const { user } = useContext(AuthContext); // Hent brugerinformation fra AuthContext
  const [isFormVisible, setIsFormVisible] = useState(false); // Kontrol for modalens synlighed
  const [reviewData, setReviewData] = useState({
    title: '',
    content: '',
    num_stars: '',
    estate_id: ''
  });
  const [isButtonClicked, setIsButtonClicked] = useState(false); // State til at holde styr på knapklik

  useEffect(() => {
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
      }
    };

    loadReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 8000); // Skift hver 5. sekund

      return () => clearInterval(interval);
    }
  }, [reviews]);

  const renderStars = (numStars) => {
    const starsArray = [];
    for (let i = 0; i < numStars; i++) {
      starsArray.push(<span key={i}>★</span>);
    }
    return starsArray;
  };

  const handleWriteReviewClick = useCallback(() => {
    if (!user) {
      alert('Du skal være logget ind for at skrive en anmeldelse.');
      return;
    }
    setIsButtonClicked(true); // Sæt knappen til klikket
    setIsFormVisible(true);
  }, [user]);

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
      setIsButtonClicked(false); // Reset knapklik state
    }
  }, [user, reviewData]);

  return (
    <section className={styles.reviewsSection}>
       <h2 className={styles.h}>Det siger vores kunder</h2>
      <div className={styles.reviewContainer}>
        {reviews.length > 0 ? (
          <div
            className={`${styles.reviewItem} ${styles['reviewItem-enter']} ${styles['reviewItem-enter-active']}`}
            key={reviews[currentReviewIndex].id} // Key ændres for at trigge animation
          >
            <p><strong>{reviews[currentReviewIndex].title}</strong></p>
            <p>{reviews[currentReviewIndex].content}</p>
            <p>{renderStars(reviews[currentReviewIndex].num_stars)}</p>
          </div>
        ) : (
          <p>Der er endnu ikke givet nogle anmeldelser.</p>
        )}
      </div>

      {/* Knappen til at skrive en anmeldelse */}
      <button
        className={`${styles.writeReviewButton} ${isButtonClicked ? styles.clicked : ''}`}
        onClick={handleWriteReviewClick}
      >
        Skriv en anmeldelse
      </button>

      {/* Formular-modal for anmeldelsen */}
      {user && (
        <FormModal
          isVisible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
          onSubmit={handleReviewSubmit}
          reviewData={reviewData}
          setReviewData={setReviewData}
        />
      )}
    </section>
  );
};

export default ReviewSection;
