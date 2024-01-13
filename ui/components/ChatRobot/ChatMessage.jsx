import React, { useState } from 'react';
import { marked } from 'marked';
import { FaCopy, FaPaperPlane, FaInfo } from 'react-icons/fa';
import styles from './ChatMessage.module.css';

export default function ChatMessage({ className, onClick, message, handleInsertText }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function handleCopyClick(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(message.content)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Error in copying text: ', err);
      });
  }

  function handleSendClick(e) {
    e.stopPropagation();
    handleInsertText(message.text);
  }

  function handleInfoClick(e) {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }

  const getSenderIcon = (type) => {
    switch (type) {
      case 'ai':
        return '/images/wencheng.png';
      case 'human':
        return '/images/you.jpeg';
      default:
        return '/images/wencheng.png';
    }
  }

  return (
    <div className={[className, styles.chatMessage].join(" ")} onClick={onClick}>
      <div className={styles.messageActions}>
        <button className={styles.copyButton} onClick={handleCopyClick}>
          <FaCopy />
        </button>
        <button className={styles.sendButton} onClick={handleSendClick}>
          <FaPaperPlane />
        </button>
        <button className={styles.infoButton} onClick={handleInfoClick}>
          <FaInfo />
        </button>
      </div>
      <img className={styles.avatar} src={getSenderIcon(message.type)} alt={message.type} />
      <div className={styles.messageContent}>
        <strong className={styles.senderName}>{message.type}</strong>
        <div className={styles.messageText} dangerouslySetInnerHTML={{ __html: marked(message.content || "") }} />
      </div>
    </div>
  );
}