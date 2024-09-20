import React, { useState, useEffect, useContext } from 'react'; 
import { Link } from 'react-router-dom';
import supabase from '../../supabase'; 
import styles from './MinSide.module.scss'; 
import { AuthContext } from '../providers/AuthContext';

const MinSide = () => {
  // Definerer state til at holde liked estates, bruger anmeldelser, brugerdata osv.
  const [likedEstates, setLikedEstates] = useState([]); // Liste over likede boliger
  const [userReviews, setUserReviews] = useState([]); // Liste over brugerens anmeldelser
  const [user, setUser] = useState(null); // Opbevarer brugerens information
  const [editingReviewId, setEditingReviewId] = useState(null); // ID for anmeldelse der redigeres
  const [reviewData, setReviewData] = useState({ title: '', content: '', num_stars: 1 }); // Data til anmeldelse
  const [isEditing, setIsEditing] = useState(false); // Status for om vi redigerer en anmeldelse
  const { isLoggedIn } = useContext(AuthContext); // Henter loginstatus fra AuthContext

  useEffect(() => {
    // Henter brugerdata fra Supabase ved login
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser(); // Henter den aktuelle bruger
      setUser(user); // Opdaterer state med brugerdata

      if (user) {
        // Henter favoritter for den loggede bruger
        const { data: favorites } = await supabase
          .from('favorites')
          .select('estate_id')
          .eq('user_id', user.id);

        if (favorites.length > 0) {
          // Mapper estate_ids fra favoritter
          const estateIds = favorites.map(favorite => favorite.estate_id);
          const { data: estates } = await supabase
            .from('estates')
            .select('*')
            .in('id', estateIds);
          setLikedEstates(estates); // Opdaterer state med likede boliger
        }

        // Henter brugerens anmeldelser
        const { data: reviews } = await supabase
          .from('reviews')
          .select('id, title, content, num_stars')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setUserReviews(reviews); // Opdaterer state med anmeldelser
      }
    };

    // Kald fetchUserData hvis brugeren er logget ind
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]); // Kører ved ændringer i loginstatus

  const handleEditClick = (review) => {
    // Sætter state til redigering af anmeldelse
    setEditingReviewId(review.id);
    setReviewData({ title: review.title, content: review.content, num_stars: review.num_stars });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {//Funktionen modtager en event (e), der repræsenterer brugerens interaktion med et inputelement. Når brugeren skriver i et inputfelt, bliver handleInputChange kaldt med den relevante event.
    // Opdaterer reviewData ved inputændringer
    const { name, value } = e.target; // Her destrukturerer vi name og value fra e.target, som refererer til det specifikke inputelement, der har ændret sig.
    //name er navnet på inputfeltet (f.eks. "title", "content" eller "num_stars"), og value er den aktuelle værdi, som brugeren har indtastet.
  
    // Opdaterer state for reviewData
    setReviewData((prev) => ({
      ...prev, // Beholder de tidligere værdier i reviewData
      [name]: value // Opdaterer den specifikke værdi baseret på inputfeltets name-attribut
    }));
  };
  

  const handleEditSubmit = async (e) => {
    e.preventDefault(); // Denne linje forhindrer den normale opførsel ved formularindsendelse, som typisk ville forårsage en sideopdatering. Dette er vigtigt for at sikre, at React kan håndtere formularen uden at forlade siden.
    try {
      // Opdaterer anmeldelse i databasen
      const { error } = await supabase
        .from('reviews')
        .update(reviewData) //Vi anvender Supabase's update metode til at ændre anmeldelsen i databasen.
        .eq('id', editingReviewId);

      if (!error) {
        setIsEditing(false); // Lukker redigeringsmodus
        setEditingReviewId(null); // Nulstiller det ID, der var i redigering, så systemet ved, at der ikke er nogen aktiv redigering.
        setReviewData({ title: '', content: '', num_stars: 1 }); // Nulstiller review data
        const { data: updatedReviews } = await supabase //Henter de opdaterede anmeldelser for den nuværende bruger fra databasen.
        //Dataene sorteres, så de nyeste anmeldelser vises først.
          .from('reviews')
          .select('id, title, content, num_stars')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setUserReviews(updatedReviews); // Opdaterer anmeldelser efter redigering
      }
    } catch (error) {
      console.error('Fejl ved opdatering af anmeldelse:', error); // Logger fejl
    }
  };

  const handleDeleteClick = async (reviewId) => {
    // Bekræfter og sletter anmeldelse
    if (window.confirm('Er du sikker på, at du vil slette denne anmeldelse?')) {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (!error) {
        setUserReviews(userReviews.filter(review => review.id !== reviewId)); // Fjerner anmeldelsen fra state
      }
    }
  };

  if (!isLoggedIn) {
    return <p>Log venligst ind for at se dine likede boliger og anmeldelser.</p>; // Viser besked hvis ikke logget ind
  }

  return (
    <div>
      <div className={styles.velkommen}>
        <h1>Velkommen til Min side</h1>
        <p>Du er logget ind som {user ? user.email : 'Indlæser...'}</p>
      </div>

      {/* Redigeringsformular for anmeldelser */}
      {isEditing && (
        <div className={styles.formContainer}>
          <form onSubmit={handleEditSubmit} className={styles.editForm}>
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

      {/* Liste over likede boliger */}
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

        {/* Liste over brugerens anmeldelser */}
        <div className={styles.reviewsList}>
          <h2>Mine anmeldelser</h2>
          {userReviews.length > 0 ? (
            <ul>
              {userReviews.map(review => (
                <li key={review.id}>
                  <h4>{review.title}</h4>
                  <p>{review.content}</p>
                  <p>Stjerner: {review.num_stars}</p>
                  <div className={styles.reviewButtons}>
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
    </div>
  );
};

export default MinSide; // Eksporterer komponenten for brug i andre dele af applikationen
