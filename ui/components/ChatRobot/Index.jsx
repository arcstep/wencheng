import React, { useState } from 'react';
import ChatMessageSender from './ChatMessageSender';
import ChatHistory from './ChatHistory';

export default function ChatRobot({ handleInsertText }) {
  const dateObject = new Date();

  const [messageSentHistory, setMessageSentHistory] = useState(["hi", "你是文成公主吗？"]);
  const addMessageSentToHistory = (message) => {
    setMessageSentHistory(prevHistory => [message, ...prevHistory]);
  };
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      timestamp: dateObject.getTime(),
      senderName: '文成公主',
      senderIcon: "/images/wencheng.png",
      text: '你好！',
      quotes: []
    },
    {
      id: 2,
      timestamp: dateObject.getTime(),
      senderName: '你',
      senderIcon: "/images/you.jpeg",
      text: '我很好，文成公主。',
      quotes: ['你好！']
    },
    {
      id: 3,
      timestamp: dateObject.getTime(),
      senderName: '文成公主',
      senderIcon: "/images/wencheng.png",
      text: '我能帮你做什么？',
      quotes: ['我很好，文成公主。']
    },
    {
      id: 4,
      timestamp: dateObject.getTime(),
      senderName: '你',
      senderIcon: "/images/you.jpeg",
      text: '我要写一份税务信息化项目的投标书。',
      quotes: ['我能帮你做什么？']
    },
    {
      id: 5,
      timestamp: dateObject.getTime(),
      senderName: '文成公主',
      senderIcon: "/images/wencheng.png",
      text: '好的，首先你需要明确投标书的目标和需求。例如，你可以这样写：\n\n> **目标**：为税务局提供优质的信息化服务\n\n> **需求**：需要一套完整的税务信息化解决方案',
      quotes: ['我要写一份税务信息化项目的投标书。']
    },
    {
      id: 6,
      timestamp: dateObject.getTime(),
      senderName: '你',
      senderIcon: "/images/you.jpeg",
      text: '我明白了，然后呢？',
      quotes: ['好的，首先你需要明确投标书的目标和需求。例如，你可以这样写：\n\n> **目标**：为税务局提供优质的信息化服务\n\n> **需求**：需要一套完整的税务信息化解决方案']
    },
    {
      id: 7,
      timestamp: dateObject.getTime(),
      senderName: '文成公主',
      senderIcon: "/images/wencheng.png",
      text: '然后，你需要详细描述你的解决方案和实施计划。例如：\n\n> **解决方案**：我们将提供一套包括硬件、软件和服务在内的全面税务信息化解决方案\n\n> **实施计划**：我们将在3个月内完成所有的安装和配置工作',
      quotes: ['我明白了，然后呢？']
    },
    {
      id: 8,
      timestamp: dateObject.getTime(),
      senderName: '你',
      senderIcon: "/images/you.jpeg",
      text: '好的，我会尽量详细。',
      quotes: ['然后，你需要详细描述你的解决方案和实施计划。例如：\n\n> **解决方案**：我们将提供一套包括硬件、软件和服务在内的全面税务信息化解决方案\n\n> **实施计划**：我们将在3个月内完成所有的安装和配置工作']
    },
    {
      id: 9,
      timestamp: dateObject.getTime(),
      senderName: '文成公主',
      senderIcon: "/images/wencheng.png",
      text: '最后，别忘了提供你的联系方式和报价。例如：\n\n> **联系方式**：电话：12345678，邮箱：example@example.com\n\n> **报价**：我们的总报价为100万元',
      quotes: ['好的，我会尽量详细。']
    },
    {
      id: 10,
      timestamp: dateObject.getTime(),
      senderName: '你',
      senderIcon: "/images/you.jpeg",
      text: '谢谢你的建议，文成公主。',
      quotes: ['最后，别忘了提供你的联系方式和报价。例如：\n\n> **联系方式**：电话：12345678，邮箱：example@example.com\n\n> **报价**：我们的总报价为100万元']
    },
  ]);

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
