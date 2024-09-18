import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './MinSide.module.scss';
import { AuthContext } from '../providers/AuthContext';

const MinSide = () => {
  const [likedEstates, setLikedEstates] = useState([]); // State til at gemme brugerens likede boliger
  const [userReviews, setUserReviews] = useState([]); // State til at gemme brugerens anmeldelser
  const [user, setUser] = useState(null); // State til at gemme den autentificerede bruger
  const [editingReviewId, setEditingReviewId] = useState(null); // State til at holde styr på, hvilken anmeldelse der redigeres
  const [editedReview, setEditedReview] = useState(''); // State til at holde den redigerede anmeldelse
  const [isEditing, setIsEditing] = useState(false); // State til at indikere om der er en anmeldelse i redigering
  const { isLoggedIn } = useContext(AuthContext); // Henter login-status fra AuthContext

  useEffect(() => {
    const fetchUserData = async () => {
      // Henter den autentificerede bruger
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Henter brugerens likede boliger
        const { data: favorites, error: favoriteError } = await supabase
          .from('favorites')
          .select('estate_id')
          .eq('user_id', user.id);

        if (favoriteError) {
          console.error('Fejl ved hentning af likede boliger', favoriteError);
          return;
        }

        if (favorites.length > 0) {
          const estateIds = favorites.map(favorite => favorite.estate_id);

          // Henter boliger baseret på ID'er fra likede boliger
          const { data: estates, error: estateError } = await supabase
            .from('estates')
            .select('*')
            .in('id', estateIds);

          if (estateError) {
            console.error('Fejl ved hentning af boliger', estateError);
          } else {
            setLikedEstates(estates); // Opdaterer state med likede boliger
          }
        }

        // Henter brugerens anmeldelser og tilknytter bolig-titler
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            id, content, 
              title
            
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Fejl ved hentning af brugerens anmeldelser', reviewsError);
        } else {
          setUserReviews(reviews); // Opdaterer state med anmeldelser
        }
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleUnlike = async (estateId) => {
    // Fjerner en bolig fra brugerens likede boliger
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('estate_id', estateId);

    // Opdaterer listen over likede boliger
    const { data: favorites, error: favoriteError } = await supabase
      .from('favorites')
      .select('estate_id')
      .eq('user_id', user.id);

    if (favoriteError) {
      console.error('Fejl ved hentning af opdaterede likede boliger', favoriteError);
      return;
    }

    if (favorites.length > 0) {
      const estateIds = favorites.map(favorite => favorite.estate_id);

      // Henter boliger baseret på opdaterede likede boliger
      const { data: estates, error: estateError } = await supabase
        .from('estates')
        .select('*')
        .in('id', estateIds);

      if (estateError) {
        console.error('Fejl ved hentning af boliger', estateError);
      } else {
        setLikedEstates(estates); // Opdaterer state med opdaterede likede boliger
      }
    } else {
      setLikedEstates([]); // Ingen likede boliger tilbage
    }
  };

  const handleEditClick = (review) => {
    // Starter redigeringsmodus for den valgte anmeldelse
    setEditingReviewId(review.id);
    setEditedReview(review.content);
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditedReview(e.target.value); // Opdaterer den redigerede anmeldelse
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Opdaterer anmeldelse i databasen
      const { error } = await supabase
        .from('reviews')
        .update({ content: editedReview })
        .eq('id', editingReviewId);

      if (error) {
        console.error('Fejl ved opdatering af anmeldelse:', error);
      } else {
        setIsEditing(false);
        setEditingReviewId(null);
        setEditedReview('');
        // Henter opdaterede anmeldelser
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            id, content, estates (
              title
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Fejl ved hentning af opdaterede anmeldelser', reviewsError);
        } else {
          setUserReviews(reviews); // Opdaterer state med opdaterede anmeldelser
        }
      }
    } catch (error) {
      console.error('Fejl ved redigering af anmeldelse:', error);
    }
  };

  const handleDeleteClick = async (reviewId) => {
    if (window.confirm('Er du sikker på, at du vil slette denne anmeldelse?')) {
      try {
        // Sletter anmeldelse fra databasen
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', reviewId);

        if (error) {
          console.error('Fejl ved sletning af anmeldelse:', error);
        } else {
          setUserReviews(userReviews.filter(review => review.id !== reviewId)); // Opdaterer state med slettede anmeldelser
        }
      } catch (error) {
        console.error('Fejl ved sletning af anmeldelse:', error);
      }
    }
  };

  if (!isLoggedIn) {
    return <p>Log venligst ind for at se dine likede boliger og anmeldelser.</p>;
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.likedEstatesList}>
        <h3>Mine likede boliger</h3>
        {likedEstates.length > 0 ? (
          <ul>
            {likedEstates.map(estate => (
              <li key={estate.id} className={styles.estateItem}>
                <div>
                  <Link to={`/boliger/${estate.id}`}>
                    {estate.address}
                  </Link>
                </div>
                <button onClick={() => handleUnlike(estate.id)} className={styles.button}>Fjern</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Du har ikke liket nogen boliger endnu.</p>
        )}
      </div>
      <div className={styles.reviewsList}>
        <h3>Mine anmeldelser</h3>
        {userReviews.length > 0 ? (
          <ul>
            {userReviews.map(review => (
              <li key={review.id} className={styles.reviewItem}>
                <div>
                  <h4>{review.title}</h4>
                  <p>{review.content}</p>
                </div>
                <button onClick={() => handleEditClick(review)} className={styles.button}>Rediger</button>
                <button onClick={() => handleDeleteClick(review.id)} className={styles.button}>Slet</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Du har ikke skrevet nogen anmeldelser endnu.</p>
        )}
      </div>
      {isEditing && (
        <div className={styles.editReview}>
          <h3>Rediger anmeldelse</h3>
          <form onSubmit={handleEditSubmit}>
            <textarea value={editedReview} onChange={handleEditChange} />
            <button type="submit" className={styles.button}>Gem</button>
            <button type="button" onClick={() => setIsEditing(false)} className={styles.button}>Annuller</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MinSide;
