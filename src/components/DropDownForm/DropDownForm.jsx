import React, { useState } from 'react';
import styles from './DropdownForm.module.scss'; 
import supabase from '../../../supabase';

const DropdownForm = ({ user }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);

  // Toggle visibility of the form
  const handleToggle = () => {
    if (user) {
      // Hvis brugeren er logget ind, toggler vi visningen af formularen
      setIsVisible(prev => !prev);
      setIsNotLoggedIn(false); // Reset login prompt
    } else {
      // Hvis brugeren ikke er logget ind, vis login prompt
      setIsNotLoggedIn(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; // Forhindr indsendelse, hvis ikke logget ind

    const reviewContent = e.target.elements.reviewContent.value;

    // Indsæt anmeldelsen i Supabase
    const { error } = await supabase
      .from('reviews')
      .insert([{
        user_id: user.id,
        estate_id: null, 
        title: 'New Review',
        content: reviewContent,
        num_stars: 5, 
        created_at: new Date().toISOString(),
        is_active: true
      }]);

    if (error) {
      console.error('Error submitting review:', error);
    } else {
      setIsVisible(false); // Skjul formularen efter indsending
      setIsNotLoggedIn(false); // Reset login prompt
    }
  };

  return (
    <div className={styles.dropdownMenuContainer}>
      <button className={styles.toggleButton} onClick={handleToggle}>
        Skriv en anmeldelse
      </button>
      {isVisible && user && (
        <form className={styles.reviewForm} onSubmit={handleSubmit}>
          <textarea
            name="reviewContent"
            className={styles.reviewTextarea}
            placeholder="Skriv din anmeldelse her..."
            required
          />
          <button type="submit" className={styles.submitButton}>Send anmeldelse</button>
        </form>
      )}
      {isVisible && !user && isNotLoggedIn && (
        <div className={styles.loginPrompt}>
          Du skal være logget ind for at skrive en anmeldelse. <a href="/login">Log ind her</a>.
        </div>
      )}
    </div>
  );
};

export default DropdownForm;
