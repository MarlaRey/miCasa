// src/components/Loader/Loader.jsx
import React from 'react';
import styles from './Loader.module.scss'; // Importér stilarter til loaderen

const Loader = () => {
  return (
    <div className={styles.loader}>
   
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;
