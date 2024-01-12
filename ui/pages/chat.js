import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import chat_history from './api/chat_api';

const ChatPage = () => {
  const [chatHistory, setChatHistory] = useState([]);  
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await chat_history();
        console.log("Chat history:", data);
        setChatHistory(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChatHistory();
  }, []);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // 在这里发送你的消息
    console.log(currentMessage);
    // 将新的消息添加到聊天记录中
    setChatHistory([...chatHistory, currentMessage]);
    setCurrentMessage('');
  };

  return (
    <Layout title="我们随便聊聊">
      <ul>
        {chatHistory.map(({ seq, user_id, text, timestamp }) => (
          <li key={seq}>{ user_id }({timestamp}): {text}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message here"
        />
        <button type="submit">Send</button>
      </form>
    </Layout>
  );
};

export default ChatPage;