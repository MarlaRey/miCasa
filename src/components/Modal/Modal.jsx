import React from 'react';
import styles from './Modal.module.scss';

const Modal = ({ contentType, onClose, estateId }) => {
  const renderContent = () => {
    switch (contentType) {
      case 'gallery':
        return <EstateGallery estateId={estateId} />;
      case 'floorplan':
        return <EstateFloorplan estateId={estateId} />;
      case 'map':
        return <EstateMap estateId={estateId} />;
      default:
        return <p>Unknown content type</p>;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        {renderContent()}
      </div>
    </div>
  );
};

const EstateGallery = ({ estateId }) => {
  const [images, setImages] = React.useState([]);

  React.useEffect(() => {
    // Fetch images for the estate
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('estate_image_rel')
        .select('images(image_url)')
        .eq('estate_id', estateId);

      if (error) console.error('Error fetching images:', error);
      else setImages(data.map(rel => rel.images.image_url));
    };

    fetchImages();
  }, [estateId]);

  return (
    <div className={styles.gallery}>
      {images.map((url, index) => (
        <img key={index} src={url} alt={`Gallery Image ${index + 1}`} className={styles.galleryImage} />
      ))}
    </div>
  );
};

const EstateFloorplan = ({ estateId }) => {
  // Implement logic to fetch and display the floorplan
  return <div>Floorplan for Estate {estateId}</div>;
};

const EstateMap = ({ estateId }) => {
  // Implement logic to fetch and display the map
  return <div>Map for Estate {estateId}</div>;
};

export default Modal;
