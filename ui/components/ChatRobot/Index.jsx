import React, { useState, useEffect } from 'react';
import ChatMessageSender from './ChatMessageSender';
import ChatHistory from './ChatHistory';
import { chat_history } from '../../api/chat_history';

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
    <div className='messages-box'>
      <style>
        {`
        .messages-box {
          display: flex;
          flex-direction: column;
          height: 100%;
          margin: 0px 3px;
        }

        .message-header {
          align-self: start;
          margin: 3px 5px;
        }

        .messages-history {
          overflow: auto;  /* 如果内容超出了高度，就显示滚动条 */
          flex: 1;  /* 占据剩余空间 */
        }

        .message-sender {
          width: 100%;
          align-self: end;  /* 固定在底部 */
        }
      `}
      </style>

      <div className='message-header'>@文成公主 openai, gpt3.5 turbo</div>
      <ChatHistory className='messages-history' messages={messages} handleInsertText={handleInsertText} />
      <ChatMessageSender
        className='message-sender'
        setMessages={setMessages}
        messageSentHistory={messageSentHistory}
        addMessageSentToHistory={addMessageSentToHistory}
      />
    </div>
  );
}
