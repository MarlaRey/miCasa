import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './MinSide.module.scss';
import { AuthContext } from '../providers/AuthContext';

const MinSide = () => {
  const [likedEstates, setLikedEstates] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewData, setReviewData] = useState({ title: '', content: '', num_stars: 1 });
  const [isEditing, setIsEditing] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: favorites } = await supabase
          .from('favorites')
          .select('estate_id')
          .eq('user_id', user.id);

        if (favorites.length > 0) {
          const estateIds = favorites.map(favorite => favorite.estate_id);
          const { data: estates } = await supabase
            .from('estates')
            .select('*')
            .in('id', estateIds);
          setLikedEstates(estates);
        }

        const { data: reviews } = await supabase
          .from('reviews')
          .select('id, title, content, num_stars')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setUserReviews(reviews);
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setReviewData({ title: review.title, content: review.content, num_stars: review.num_stars });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', editingReviewId);

      if (!error) {
        setIsEditing(false);
        setEditingReviewId(null);
        setReviewData({ title: '', content: '', num_stars: 1 });
        const { data: updatedReviews } = await supabase
          .from('reviews')
          .select('id, title, content, num_stars')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setUserReviews(updatedReviews);
      }
    } catch (error) {
      console.error('Fejl ved opdatering af anmeldelse:', error);
    }
  };

  const handleDeleteClick = async (reviewId) => {
    if (window.confirm('Er du sikker på, at du vil slette denne anmeldelse?')) {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (!error) {
        setUserReviews(userReviews.filter(review => review.id !== reviewId));
      }
    }
  };

  if (!isLoggedIn) {
    return <p>Log venligst ind for at se dine likede boliger og anmeldelser.</p>;
  }

  return (
    <div >
      <div className={styles.velkommen}>
      <h1>Velkommen til Min side </h1>
      <p>Du er logget ind som {user ? user.email : 'Indlæser...'}</p>


      </div>
      {/* Liked Estates */}
      <div className={styles.mainContainer}>
      <div className={styles.likedEstatesList}>
        <h2>Mine favoritter</h2>
        {likedEstates.length > 0 ? (
          <ul>
            {likedEstates.map(estate => (
              <li key={estate.id}>
                 <button onClick={() => handleUnlike(estate.id)}>Fjern</button>
                <Link to={`/boliger/${estate.id}`}>{estate.address}</Link>
               
              </li>
            ))}
          </ul>
        ) : (
          <p>Du har ikke liket nogen boliger endnu.</p>
        )}
      </div>

      {/* User Reviews */}
      <div className={styles.reviewsList}>
        <h2>Mine anmeldelser</h2>
        {userReviews.length > 0 ? (
          <ul>
            {userReviews.map(review => (
              <li key={review.id}>
                <h4>{review.title}</h4>
                <p>{review.content}</p>
                <p>Stjerner: {review.num_stars}</p>
                <div  className={styles.reviewButtons}>
                <button onClick={() => handleEditClick(review)}>Rediger</button>
                <button onClick={() => handleDeleteClick(review.id)}>Slet</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Du har ikke skrevet nogen anmeldelser endnu.</p>
        )}
      </div>
      </div>
      {/* Edit Review Form */}
      {isEditing && (
        <div className={styles.formContainer}>

          <form  onSubmit={handleEditSubmit} className={styles.editForm}>
          <h3>Rediger anmeldelse</h3>
            <div>
              <input
                type="text"
                name="title"
                value={reviewData.title}
                onChange={handleInputChange}
                placeholder="Title"
                required
              />
            </div>
            <div>
              <textarea
                name="content"
                value={reviewData.content}
                onChange={handleInputChange}
                placeholder="Anmeldelse"
                required
              />
            </div>
            <div>
              <select
                name="num_stars"
                value={reviewData.num_stars}
                onChange={handleInputChange}
                required
              >
                <option value="1">1 stjerne</option>
                <option value="2">2 stjerner</option>
                <option value="3">3 stjerner</option>
                <option value="4">4 stjerner</option>
                <option value="5">5 stjerner</option>
              </select>
            </div>
            <div className={styles.reviewButtonsRE}>
            <button type="submit">Gem</button>
            <button type="button" onClick={() => setIsEditing(false)}>Annuller</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MinSide;
