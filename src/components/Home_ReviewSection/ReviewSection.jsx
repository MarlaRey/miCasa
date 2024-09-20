import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Importerer useNavigate for at kunne omdirigere efter man har sendt
import supabase from '../../../supabase';
import styles from './ReviewSection.module.scss';
import { AuthContext } from '../../providers/AuthContext';
import FormModal from '../FormModal/FormModal'; // Importerer selve formular-komponentet

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
  const navigate = useNavigate(); // Opret navigate-funktionen

  useEffect(() => {
    const loadReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false }); //sorterer efter nyeste først
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
      }, 8000); // Skift hver 8. sekund

      return () => clearInterval(interval);
    }
  }, [reviews]);

  const renderStars = (numStars) => {
    const starsArray = []; // initialiserer en tom array, som skal fyldes med stjerneikoner.
    for (let i = 0; i < numStars; i++) { // starter en løkke, der kører et antal gange, som svarer til værdien af numStars.
      starsArray.push(<span key={i}>★</span>); //Hver stjerne får en unik key værdi baseret på indeks i, som er vigtig for React, når den håndterer lister.
    }
    return starsArray;
  };

  // useCallback-hooket i React bruges til at cache en funktion og kun genoprette den, når dens afhængigheder ændrer sig. 
  const handleWriteReviewClick = useCallback(() => {
    // Tjekker om brugeren er logget ind
    if (!user) {
      alert('Du skal være logget ind for at skrive en anmeldelse.');
      return; // Stopper funktionen, hvis brugeren ikke er logget ind
    }
    setIsButtonClicked(true); // Sætter tilstand for knappen til klikket
    setIsFormVisible(true); // Viser anmeldelsesformularen
  }, [user]); // Afhængighed: funktionen genoprettes kun, når 'user' ændrer sig

  const handleReviewSubmit = useCallback(async (e) => {
    e.preventDefault(); // Forhindrer standardformularens submit-adfærd
    // Tjekker om brugeren er logget ind igen
    if (!user) {
      alert('Du skal være logget ind for at skrive en anmeldelse.'); 
      return; // Stopper funktionen, hvis brugeren ikke er logget ind
    }

    // Indsætter anmeldelsen i 'reviews' tabellen i Supabase
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

    // Tjekker for fejl ved indsendelse af anmeldelsen
    if (error) {
      console.error('Error submitting review:', error); // Logger fejlen i konsollen
      alert('Der opstod en fejl ved indsendelse af anmeldelsen.'); // Advarer brugeren om fejlen
    } else {
      // Rydder formularens data efter en vellykket indsendelse
      setReviewData({ title: '', content: '', num_stars: '', estate_id: '' });
      setIsFormVisible(false); // Skjuler anmeldelsesformularen
      setIsButtonClicked(false); // Resetter knapklik state

      // Omdirigerer til tak-siden
      navigate('/anmeldelse-modtaget');
    }
  }, [user, reviewData, navigate]); // Afhængigheder: funktionen genoprettes, når 'user', 'reviewData', eller 'navigate' ændrer sig


  return (

      <section className={styles.reviewsSection}>
        <h2 className={styles.h}>Det siger vores kunder</h2>
        <div className={styles.reviewContainer}>
          {reviews.length > 0 ? (
            <div className={styles.reviewItem}>
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
  }

export default ReviewSection;
