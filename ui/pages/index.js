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
      {!hasHistory && (
        <div className={styles.header}>
          <h1>我是AI助手，猜猜我能为你做什么？</h1>
        </div>
      )}

      {!hasHistory && (
        <div className={styles.questions}>
          <div>
            <span>💦 宿舍需要设置喷淋吗？</span>
          </div>
          <div>
            <span>🧯 消防值班有什么要求？</span>
          </div>
        </div>
      )}

      <div className={styles.agents}>
        <AgentSelector setSelectedApi={setSelectedApi} />
      </div>

      <div className={styles.body}>
        <ChatRobot selectedApi={selectedApi} onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
};

export default Layout;