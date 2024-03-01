import React from 'react';
import { marked } from 'marked';
import styles from './ChatMessage.module.css';

export default function ChatMessage({ className, onClick, message }) {
  const getSenderIcon = (type) => {
    switch (type) {
      case '你':
        return '/images/you.jpeg';
      default:
        return '/images/wencheng.png';
    }
  }

  return (
    <div className={[className, styles.chatMessage].join(" ")} onClick={onClick}>
      <img className={styles.avatar} src={getSenderIcon(message.type)} alt={message.type} />
      <div className={styles.messageContent}>
        <strong className={styles.senderName}>{message.type}</strong>
        <div className={styles.messageText} dangerouslySetInnerHTML={{ __html: marked(message.content || "") }} />
      </div>
    </div>
  );
}