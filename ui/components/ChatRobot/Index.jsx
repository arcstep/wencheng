import React, { useState, useEffect } from 'react';
import ChatMessageSender from './ChatMessageSender';
import ChatHistory from './ChatHistory';
import { chat_history, new_session } from '../../api/chat_history';
import styles from './Index.module.css';

export default function ChatRobot({ selectedApi, onNewMessage }) {
  const [chatSessionId, setChatSessionId] = useState(null); // 会话 ID，用于区分不同的会话
  const [messages, setMessages] = useState([]);
  const [messageSentHistory, setMessageSentHistory] = useState(["hi", "你是文成公主吗？"]);
  const [streamRespondingMessage, setStreamRespondingMessage] = useState([]);
  const addMessageSentToHistory = (message) => {
    setMessageSentHistory(prevHistory => [message, ...prevHistory]);
  };

  const newChatSession = async () => {    
    const id = await new_session()
    setChatSessionId(id);
    setMessages([]);
  };

  useEffect(() => {
    if(messages.length > 0) {
      onNewMessage(true)
    }
  }, [messages])

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (chatSessionId === null) {
        newChatSession();
      } else {
        try {
          const data = await chat_history(chatSessionId);
          setMessages(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    fetchHistoryData();
  }, []); // 组件挂载后仅从服务端拉取执行一次，除非手动更新

  return (
    <div className={ styles.layout }>
      <ChatHistory className={styles.history} messages={[...messages, ...streamRespondingMessage]} />
      <ChatMessageSender
        className={styles.sender}
        chatSessionId={chatSessionId}
        apiAgent={selectedApi}
        messages={messages}
        setMessages={setMessages}
        setStreamRespondingMessage={setStreamRespondingMessage}
        messageSentHistory={messageSentHistory}
        addMessageSentToHistory={addMessageSentToHistory}
      />
    </div>
  );
}
