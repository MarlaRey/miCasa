import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from './EstateCard.module.scss'; 

const EstateCard = ({ estate, isHome }) => { 
  // Komponent modtager 'estate' objektet (boligdata) og en 'isHome' prop til at styre, om vi er på forsiden, fordi der er en stylingsforskel på der hvro cardsene bliver brugt
  
  const cardClass = isHome ? `${styles.card} ${styles.homeCard}` : styles.card; 
  // Dynamisk tildeling af CSS-klasser. Hvis vi er på forsiden, tilføjes både '.card' og '.homeCard' klasserne.
  
  return (
    <div className={cardClass}> 
      <img 
        src={estate.image_url} 
        alt={`Image of ${estate.address}`} 
        className={styles.cardImage} 
      /> 
      
      <div className={styles.cardContent}>
        
        <h3>{estate.address}</h3> 

        
        <p>{estate.price} DKK</p> 

        
        <p>{estate.city}</p> 

        
        <p>{estate.floor_space} m²</p> 

        
        <p>{estate.energy_label_id}</p> 

        
        <Link to={`/boliger/${estate.id}`} className={styles.detailsLink}>
          Se detaljer
        </Link> 

      </div>
    </div>
  );
};

export default EstateCard; 

