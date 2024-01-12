import React, { useState } from 'react';
import Layout from '../components/Layout';

const ChatPage = () => {
  const [currentMessage, setCurrentMessage] = useState('');

  // 创建模拟的聊天记录
  const [messages, setMessages] = useState([
    '你好，公主殿下',
    '你好，我是公主',
    '今天天气不错',
    '是的，很适合出去散步',
    // 添加更多的聊天记录...
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 在这里发送你的消息
    console.log(currentMessage);
    // 将新的消息添加到聊天记录中
    setMessages([...messages, currentMessage]);
    setCurrentMessage('');
  };

  return (
    <Layout title="我们随便聊聊">
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
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