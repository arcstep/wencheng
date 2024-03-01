import React, { useState, useEffect } from 'react';
import styles from './index.module.css'
import AgentSelector from '../components/AgentSelector/Index';
import ChatRobot from '../components/ChatRobot/Index';

const Layout = () => {
  const [selectedApi, setSelectedApi] = useState('');
  const [hasHistory, setHasHistory] = useState(false);

  const handleNewMessage = () => {
    setHasHistory(true);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.agents}>
        <AgentSelector setSelectedApi={setSelectedApi} />
      </div>

      {!hasHistory && (
        <div className={styles.header}>
          <h1>猜一猜，AI能做什么？</h1>
        </div>
      )}

      <div className={styles.body}>
        <ChatRobot selectedApi={selectedApi} onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
};

export default Layout;