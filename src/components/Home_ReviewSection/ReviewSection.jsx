import React, { useEffect, useState } from 'react';
import supabase from '../../../supabase'; // Forbindelse til Supabase
import styles from './ReviewSection.module.scss';

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Skift til en tilfældig anmeldelse
      setCurrentReview((prev) => (reviews.length > 0 ? Math.floor(Math.random() * reviews.length) : prev));
    }, 5000); // Skifter hver 5. sekund
    return () => clearInterval(interval);
  }, [reviews]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, content, user_id, created_at') // Juster felterne i henhold til dine kolonner
        .limit(10); // Fetch de 10 seneste anmeldelser

      if (error) throw error;
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  if (reviews.length === 0) return <p>Ingen anmeldelser fundet.</p>;

  return (
    <section className={styles.reviewSection}>
      <div className={styles.reviewContainer}>
        <blockquote>
          <p>{reviews[currentReview]?.content}</p>
          <footer>
            <small>Bruger ID: {reviews[currentReview]?.user_id}</small>
            <br />
            <small>Dato: {new Date(reviews[currentReview]?.created_at).toLocaleDateString()}</small>
          </footer>
        </blockquote>
      </div>
    </section>
  );
};

export default ReviewSection;
