import React, { useState, useEffect } from 'react';
import supabase from '../../../supabase';
import styles from './SubmitReview.module.scss';

const SubmitReview = () => {
  const [user, setUser] = useState(null); // Brugeren
  const [review, setReview] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const getUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getUserSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{ content: review, user_id: user.id }]);

      if (error) throw error;
      setSuccess('Anmeldelsen blev sendt!');
      setReview('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (!user) return <p>Log ind for at skrive en anmeldelse.</p>;

  return (
    <div className={styles.submitReview}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Skriv din anmeldelse her"
          required
        />
        <button type="submit">Indsend anmeldelse</button>
        {success && <p className={styles.successMessage}>{success}</p>}
      </form>
    </div>
  );
};

export default SubmitReview;
