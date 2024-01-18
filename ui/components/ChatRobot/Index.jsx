import React, { useState, useEffect } from 'react';
import ChatMessageSender from './ChatMessageSender';
import ChatHistory from './ChatHistory';
import { chat_history, chat_new } from '../../api/chat_history';
import styles from './Index.module.css';

export default function ChatRobot({ handleInsertText }) {
  const [chatSessionId, setChatSessionId] = useState(null); // 会话 ID，用于区分不同的会话
  const [messages, setMessages] = useState([]);
  const [messageSentHistory, setMessageSentHistory] = useState(["hi", "你是文成公主吗？"]);
  const [streamRespondingMessage, setStreamRespondingMessage] = useState([]);
  const addMessageSentToHistory = (message) => {
    setMessageSentHistory(prevHistory => [message, ...prevHistory]);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (chatSessionId === null) {
        const id = await chat_new();
        console.log("chatSessionId", id);
        setChatSessionId(id);
      } else {
        try {
          const data = await chat_history(chatSessionId);
          setMessages(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchData();
  }, []); // 组件挂载后仅从服务端拉取执行一次，除非手动更新

  return (
    <div className={ styles.layout }>
      <div className={styles.header}>@文成公主 openai, gpt4.0</div>
      <ChatHistory className={styles.history} messages={[...messages, ...streamRespondingMessage]} handleInsertText={handleInsertText} />
      <ChatMessageSender
        className={styles.sender}
        chatSessionId={chatSessionId}
        messages={messages}
        setMessages={setMessages}
        setStreamRespondingMessage={setStreamRespondingMessage}
        messageSentHistory={messageSentHistory}
        addMessageSentToHistory={addMessageSentToHistory}
      />
    </div>
  );
}
