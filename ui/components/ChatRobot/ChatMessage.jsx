import React, { useState } from 'react';
import { marked } from 'marked';
import { FaCopy, FaPaperPlane, FaInfo } from 'react-icons/fa';
import styles from './ChatMessage.module.css';

export default function ChatMessage({ className, onClick, message, handleInsertText }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function handleCopyClick(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(message.text)
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
      <img className={styles.avatar} src={message.senderIcon} alt={message.senderName} />
      <div className={styles.messageContent}>
        {isExpanded && (
          <strong className={styles.senderName}>{message.senderName}</strong>
        )}
        <div className={styles.messageText} dangerouslySetInnerHTML={{ __html: marked(message.text) }} />
        {isExpanded && (
          <>
            {message.quotes && (
              <ul className={styles.quoteList}>
                {message.quotes.map((quote, index) => (
                  <li key={index}>{quote}</li>
                ))}
              </ul>
            )}
            <span className={styles.timestamp}>{new Date(message.timestamp).toLocaleString()}</span>
          </>
        )}
      </div>
    </div>
  );
}