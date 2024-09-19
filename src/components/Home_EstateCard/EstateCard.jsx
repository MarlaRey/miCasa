import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from './EstateCard.module.scss'; 

const EstateCard = ({ estate, isHome }) => { 
  // Komponent modtager 'estate' objektet (boligdata) og en 'isHome' prop til at styre, om vi er på forsiden, fordi der er en stylingsforskel på der hvro cardsene bliver brugt
  
  const cardClass = isHome ? `${styles.card} ${styles.homeCard}` : styles.card; 
  // Dynamisk tildeling af CSS-klasser. Hvis vi er på forsiden, tilføjes både '.card' og '.homeCard' klasserne.
  
  const energyLabelStyle = {
    backgroundColor: estate.energy_label_color
  } // Bruger farvekoden fra estate objektet
  
  
    return (
    <div className={cardClass}> 
    <Link to={`/boliger/${estate.id}`} className={styles.detailsLink}>
      <img 
        src={estate.image_url} 
        alt={`Image of ${estate.address}`} 
        className={styles.cardImage} 
      />   
    </Link> 
      
      <div className={styles.cardContent}>
        <div className={styles.headline}><h2>{estate.address}</h2>  <h2 style={energyLabelStyle}>{estate.energy_label_letter}</h2> </div>
        
        <p>{estate.city_zipcode} {estate.city_name}</p> 
        <p>{estate.estate_type_name}</p> 
        
        <p>{estate.num_rooms} værelser | {estate.floor_space} m²</p>
        <div className={styles.price}><p>{estate.price} DKK</p> </div>
        
      </div>
    </div>
  );
};

export default EstateCard; 

