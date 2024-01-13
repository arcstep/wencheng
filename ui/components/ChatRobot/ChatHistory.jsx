import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import styles from './ChatHistory.module.css'

function ChatHistory({ className, messages, handleInsertText }) {
  const messagesEndRef = useRef(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={className}>
      {messages.map((message, index) => (
        <ChatMessage 
          key={index} 
          handleInsertText={handleInsertText} 
          message={message} 
          onClick={() => setSelectedMessageId(message.id)}
          className={message.id === selectedMessageId ? 'selected' : ''}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatHistory;