// components/Layout.js
import React from 'react';
import styles from './index.module.css'
import ChatRotbot from '../components/ChatRobot/Index';

const MyAgents = function() {
  return (
    <div>
      <div>GLM4</div>
      <div>GPT4</div>
      <div>GPT3.5</div>
    </div>
  )
}

const Layout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h1>我们随便聊聊</h1>
      </div>

      <div className={styles.agents}>
        <MyAgents/>
      </div>

      <div className={styles.body}>
        <ChatRotbot />
      </div>
    </div>
  );
};

export default Layout;