// EstateCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EstateCard.module.scss'; // Importér dine stilarter

const EstateCard = ({ estate }) => {
  return (
    <div className={styles.card}>
      <img src={estate.image_url} alt={`Image of ${estate.address}`} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3>{estate.address}</h3>
        <p>{estate.price} DKK</p>
        <p>{estate.city}</p>
        <p>{estate.floor_space} m²</p>
        <p>{estate.energy_label_id}</p>
        <Link to={`/estate/${estate.id}`} className={styles.detailsLink}>Se detaljer</Link>
      </div>
    </div>
  );
};

export default EstateCard;
