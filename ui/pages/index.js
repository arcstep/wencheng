// components/Layout.js
import React, { useState } from 'react';
import styles from './index.module.css'
import AgentSelector from '../components/AgentSelector/Index';
import ChatRobot from '../components/ChatRobot/Index';

const Layout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h1>大语言模型能做什么？</h1>
      </div>

      <div className={styles.agents}>
        <AgentSelector/>
      </div>

      <div className={styles.body}>
        <ChatRobot />
      </div>
    </div>
  );
};

export default Layout;
