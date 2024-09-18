import React, { useEffect, useState } from 'react';
import supabase from '../../supabase';
import styles from './Home.module.scss';
import SliderGallery from '../components/Home_SliderGallery/SliderGallery';
import EstateSection from '../components/Home_EstateSection/EstateSection';
import FormModal from '../components/FormModal/FormModal';

const Home = ({ user }) => {
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
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      setReviews(data);

      if (data.length > 0) {
        const randomReview = data[Math.floor(Math.random() * data.length)];
        setCurrentReview(randomReview);
      }
    };

    loadReviews();
  }, []);

  // Håndter anmeldelse formular indsendelse
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Du skal være logget ind for at skrive en anmeldelse.');
      return;
    }

    const { error } = await supabase
      .from('reviews')
      .insert([
        {
          user_id: user.id, // Indsæt brugerens ID fra props
          estate_id: reviewData.estate_id,
          title: reviewData.title,
          content: reviewData.content,
          num_stars: reviewData.num_stars,
          created_at: new Date().toISOString(),
          is_active: true
        }
      ]);

    if (error) {
      console.error('Error submitting review:', error);
      alert('Der opstod en fejl ved indsendelse af anmeldelsen.');
    } else {
      setReviewData({ title: '', content: '', num_stars: '', estate_id: '' });
      setIsFormVisible(false);
      const updatedReviews = await supabase
        .from('reviews')
        .select('*')
        .eq('is_active', true);
      setReviews(updatedReviews.data);
    }
  };

  // Vis modal kun hvis brugeren er logget ind
  const handleWriteReviewClick = () => {
    if (!user) {
      alert('Du skal være logget ind for at skrive en anmeldelse.');
      return;
    }
    setIsFormVisible(true); // Kun vis modal hvis logget ind
  };

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
              <h2>Anmeldelse</h2>
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

      {/* Modal for writing a review */}
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
