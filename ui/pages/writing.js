import React, { useState } from 'react';
import styles from './Writing.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faCar, faAppleAlt } from '@fortawesome/free-solid-svg-icons';
import Layout from '../components/Layout';
import Project from '../components/Project/Index';
import Editor from '../components/Editor/Index';

const WritingPage = () => {
  const [selectedButton, setSelectedButton] = useState(1);

  const handleChangeView = (buttonNumber) => {
    setSelectedButton(buttonNumber);
  };

  return (
    <Layout title="写作">
      <div className={styles['grid-container']}>
        <div className={styles.toolbar}>
          <button className={selectedButton === 1 ? styles.selected : ''} onClick={() => handleChangeView(1)}>
            <FontAwesomeIcon icon={faCoffee} />
          </button>
          <button className={selectedButton === 2 ? styles.selected : ''} onClick={() => handleChangeView(2)}>
            <FontAwesomeIcon icon={faCar} />
          </button>
          <button className={selectedButton === 3 ? styles.selected : ''} onClick={() => handleChangeView(3)}>
            <FontAwesomeIcon icon={faAppleAlt} />
          </button>
        </div>
        <div className={`${styles.view} views`}>
          {selectedButton === 1 && <Project handleChangeView={handleChangeView} />}
          {selectedButton === 2 && <Editor />}
        </div>
      </div>
    </Layout>
  );
};

export default WritingPage;