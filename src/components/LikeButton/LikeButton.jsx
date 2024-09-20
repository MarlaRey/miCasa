import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../providers/AuthContext';
import supabase from '../../../supabase';
import styles from './LikeButton.module.scss';

import heartEmpty from '../../assets/img/icons/heartVec.png'; // Tomt hjerte
import heartFull from '../../assets/img/icons/heartFullVec.png'; // Fyldt hjerte

const LikeButton = ({ estateId }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);

  // Tjekker om boligen allerede er liket af brugeren
  useEffect(() => {
    const checkIfLiked = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: favorite, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('estate_id', estateId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Fejl ved hentning af favoritter:', error);
        } else {
          setIsLiked(!!favorite);
        }
      }
    };

    if (isLoggedIn) {
      checkIfLiked();
    }
  }, [estateId, isLoggedIn]);

  // Håndterer klik på like-knappen
  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      alert('Du skal være logget ind for at like denne bolig.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (isLiked) {
      // Hvis boligen allerede er liket, fungerer klikket som et unlike og vi fjerner detfra favoritter
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('estate_id', estateId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Fejl ved fjernelse af favorit:', error);
      } else {
        setIsLiked(false);
      }
    } else {
      // Hvis boligen ikke er liket, tilføjes den til favoritter
      const { error } = await supabase
        .from('favorites')
        .insert({
          estate_id: estateId,
          user_id: user.id
        });

      if (error) {
        console.error('Fejl ved tilføjelse af favorit:', error);
      } else {
        setIsLiked(true);
      }
    }
  };

  return (
    <button 
      className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
      onClick={handleLikeClick}
    >
      <img 
        src={isLiked ? heartFull : heartEmpty} 
        alt={isLiked ? 'Liked' : 'Not Liked'} 
        className={styles.likeIcon}
      />
    </button>
  );
};

export default LikeButton;
