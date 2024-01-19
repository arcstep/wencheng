import React, { useState } from 'react';
import styles from './Writing.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faCar, faAppleAlt } from '@fortawesome/free-solid-svg-icons';

const WritingPage = () => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonNumber) => {
    setSelectedButton(buttonNumber);
  };

  return (
    <div className={styles['grid-container']}>
      <div className={styles.toolbar}>
        <button className={selectedButton === 1 ? styles.selected : ''} onClick={() => handleButtonClick(1)}>
          <FontAwesomeIcon icon={faCoffee} />
        </button>
        <button className={selectedButton === 2 ? styles.selected : ''} onClick={() => handleButtonClick(2)}>
          <FontAwesomeIcon icon={faCar} />
        </button>
        <button className={selectedButton === 3 ? styles.selected : ''} onClick={() => handleButtonClick(3)}>
          <FontAwesomeIcon icon={faAppleAlt} />
        </button>
      </div>
      <div className={styles.view}>
        <h1>Writing Page</h1>
      </div>
    </div>
  );
};

export default WritingPage;