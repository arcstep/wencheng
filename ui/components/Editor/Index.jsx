import React from 'react';
import styles from './Index.module.css';

const GridComponent = () => {
  return (
    <div className={styles['flex-container']}>
      <div className={styles.left}>Left Side</div>
      <div className={styles.right}>Right Side</div>
    </div>
  );
};

export default GridComponent;