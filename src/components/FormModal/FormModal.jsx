import React, { useCallback } from 'react'; //useCallback-hooket i React bruges til at cache en funktion og kun genoprette den, når dens afhængigheder ændrer sig. 
import styles from './FormModal.module.scss';

// FormModal-komponenten modtager flere props: isVisible, onClose, onSubmit, reviewData, og setReviewData
const FormModal = ({ isVisible, onClose, onSubmit, reviewData, setReviewData }) => {
  
  // Hvis modalet ikke er synligt (isVisible er falsk), returnerer funktionen null og viser ikke modalet
  if (!isVisible) return null;

  // Funktion til at håndtere ændringer i inputfelter
  // Den opdaterer reviewData state ved hjælp af setReviewData, baseret på feltets navn og værdi
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    // Brug setReviewData til at opdatere det specifikke inputfelt i reviewData
    setReviewData((prev) => ({ ...prev, [name]: value }));
  }, [setReviewData]);

  // Funktion til at håndtere form-indsendelse
  // Forhindrer sideopdatering (default form submit behavior) og kalder onSubmit-proppen
  const handleSubmit = useCallback((e) => {
    e.preventDefault(); // Forhindrer standard submit-handling
    onSubmit(e); // Kalder den onSubmit funktion, der blev givet som prop
  }, [onSubmit]);
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
       
        <form onSubmit={handleSubmit}className={styles.reviewForm}>
          <div className={styles.buttonBox}>
        <button className={styles.closeButton} onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
                <path d="M480 641.077 255.462 865.615Q242.31 878.769 223.5 878.769T191.615 865.615Q178.462 852.462 178.462 833.654T191.615 801.77L416.154 577.231 191.615 352.693Q178.462 339.54 178.462 320.731T191.615 288.847Q204.769 275.694 223.577 275.694T255.462 288.847L480 513.385 704.539 288.847Q717.692 275.694 736.5 275.694T768.385 288.847Q781.538 302 781.538 320.808T768.385 352.693L543.846 577.231 768.385 801.77Q781.538 814.923 781.538 833.731T768.385 865.615Q755.231 878.769 736.423 878.769T704.539 865.615L480 641.077Z"/>
              </svg>
            </button>
            </div>
          <div className={styles.formGroup}>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={reviewData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
         
            <textarea
              name="content"
              id="content"
               placeholder="Anmeldelse"
              value={reviewData.content}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
       
            <select
              name="num_stars"
              id="num_stars"
              value={reviewData.num_stars}
              onChange={handleInputChange}
              required
            >
              <option value="">Vælg antal stjerner</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
       
            <input
              type="text"
              name="estate_id"
              id="estate_id"
              placeholder="Sagsnummer"
              value={reviewData.estate_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className={styles.buttonBox} type="submit">Send Anmeldelse</button>
        </form>
      
      </div>
    </div>
  );
};

export default FormModal;
