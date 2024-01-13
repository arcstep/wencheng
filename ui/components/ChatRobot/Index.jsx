import React, { useState, useEffect } from 'react';
import ChatMessageSender from './ChatMessageSender';
import ChatHistory from './ChatHistory';
import { chat_history } from '../../api/chat_history';
import styles from './Index.module.css';

export default function ChatRobot({ handleInsertText }) {
  const [messages, setMessages] = useState([]);
  const [messageSentHistory, setMessageSentHistory] = useState(["hi", "你是文成公主吗？"]);
  const addMessageSentToHistory = (message) => {
    setMessageSentHistory(prevHistory => [message, ...prevHistory]);
  };

  useEffect(() => {
    chat_history()
      .then(data => setMessages(data))
      .catch(error => console.error('Error:', error));
  }, []); // 组件挂载后仅从服务端拉取执行一次，除非手动更新

  return (
    <div className={ styles.layout }>
      <div className={styles.header}>@文成公主 openai, gpt4.0</div>
      <ChatHistory className={styles.history} messages={messages} handleInsertText={handleInsertText} />
      <ChatMessageSender
        className={styles.sender}
        setMessages={setMessages}
        messageSentHistory={messageSentHistory}
        addMessageSentToHistory={addMessageSentToHistory}
      />
    </div>
  );
}
