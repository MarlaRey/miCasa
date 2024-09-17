import React from 'react';
import styles from './Modal.module.scss';

const Modal = ({ type, onClose, images }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {type === 'gallery' && (
          <div>
            {/* Gallery content */}
            {images.map((img, index) => (
              <img key={index} src={img} alt={`Gallery image ${index}`} />
            ))}
          </div>
        )}
        {type === 'floorplan' && (
          <div>
            {/* Floorplan content */}
          </div>
        )}
        {type === 'map' && (
          <div>
            {/* Map content */}
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
