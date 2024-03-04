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
          <h1>猜一猜，AI能做什么？</h1>
        </div>
      )}

      {!hasHistory && (
        <div className={styles.questions}>
          <div>
            <span>🔥 贾玲最新电影票房如何？</span>
          </div>
          <div>
            <span>💰 广州有发票抽奖活动吗？</span>
          </div>
          <div>
            <span>🧯 消防对值班有什么要求？</span>
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