import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import chat_history from './api/chat_api';
import {RemoteRunnable} from "langchain/runnables/remote";

const ChatPage = () => {
  const [chatHistory, setChatHistory] = useState([]);  
  const [currentMessage, setCurrentMessage] = useState('');
  const [streamRespondingMessage, setStreamRespondingMessage] = useState([]);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

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
    console.log("Chat history:", chatHistory)
  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    // 在这里发送你的消息
    const newMessage = currentMessage;
    console.log(newMessage);
    // 将新的消息添加到聊天记录中
    const userMessage = { type: 'human', content: newMessage };
    setStreamRespondingMessage([userMessage]);
    setCurrentMessage('');
    const chain = new RemoteRunnable({url: `${base_url}/chat/`});
    let replyContent = { content: "" };
    try {
      const stream = await chain.stream(
        { 'human_input': newMessage },
        { 'configurable': { 'session_id': "4" } }
      );
      console.log("stream:", stream);

      for await (const reply of stream) {
        console.log(reply);
        let replyContentToAdd = reply.content || '';
        replyContent = {
          'type': reply.type,
          'content': replyContent.content + replyContentToAdd,
        };
        setStreamRespondingMessage([userMessage, replyContent])
      }
      setChatHistory(chatHistory => [...chatHistory, userMessage, replyContent]);
      setStreamRespondingMessage([])
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        throw error;
      }
    }
  };

  return (
    <Layout title="我们随便聊聊">
      <ul>
        {[...chatHistory, ...streamRespondingMessage].map(({ type, content }, index) => (
          <li key = {index}>{ type }: {content}</li>
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