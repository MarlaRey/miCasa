import React from 'react';
import styles from './FormModal.module.scss';

const FormModal = ({ isVisible, onClose, onSubmit, reviewData, setReviewData }) => {
  if (!isVisible) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Skriv en anmeldelse</h2>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Titel</label>
            <input
              type="text"
              name="title"
              id="title"
              value={reviewData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Anmeldelse</label>
            <textarea
              name="content"
              id="content"
              value={reviewData.content}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="num_stars">Antal Stjerner</label>
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
            <label htmlFor="estate_id">Sagsnummer (Estate ID)</label>
            <input
              type="text"
              name="estate_id"
              id="estate_id"
              value={reviewData.estate_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Send Anmeldelse</button>
        </form>
        <button className={styles.closeButton} onClick={onClose}>
          Luk
        </button>
      </div>
    </div>
  );
};

export default FormModal;
