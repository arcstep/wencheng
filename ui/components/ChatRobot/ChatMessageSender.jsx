import React, { useState, useEffect } from 'react';
import AutosizeTextarea from 'react-autosize-textarea';
import { FaPaperPlane, FaRegStopCircle } from 'react-icons/fa';
import { replyFromBot } from '../../api/robot';

function ChatMessageSender({ className, messages, setMessages, setStreamRespondingMessage, messageSentHistory, addMessageSentToHistory }) {
  const [message, setMessage] = useState('');
  const [robotIsRequesting, setRobotIsRequesting] = useState(false);
  const [controller, setController] = useState(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [thinking, setThinking] = useState('');
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (robotIsRequesting) {
      setThinking('思考中');
      const interval = setInterval(() => {
        setDots(prevDots => (prevDots + 1) % 4);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setThinking('');
      setDots(0);
    }
  }, [robotIsRequesting]);  
  
  const handleKeyDown = (event) => {
    const { selectionStart, selectionEnd, value } = event.target;

    if (event.key === 'ArrowUp' && selectionStart === 0 && selectionEnd === 0) {
      // 如果按下了上方向键，且光标位于文本的开始位置，显示上一条历史消息
      if (historyIndex < messageSentHistory.length - 1) {
        setHistoryIndex(prevIndex => prevIndex + 1);
        setMessage(messageSentHistory[historyIndex + 1]);
      }
    } else if (event.key === 'ArrowDown' && selectionStart === value.length && selectionEnd === value.length) {
      // 如果按下了下方向键，且光标位于文本的结束位置，显示下一条历史消息
      if (historyIndex > -1) {
        setHistoryIndex(prevIndex => prevIndex - 1);
        setMessage(historyIndex > 0 ? messageSentHistory[historyIndex - 1] : '');
      }
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendClick();
    }
  };
  
  const handleCancelRequest = () => {
    // 取消请求
    console.log("controller", controller)
    if (controller) {
      controller.abort();
      console.log(controller.signal.aborted); // 这应该打印 true
    }
    // 设置请求状态为 false
    setRobotIsRequesting(false);
  };

  const handleSendClick = async () => {
    if (message.trim() === '') return;
 
    // 构造用户发出的消息
    const userMessage = { type: 'human', content: message };
    setStreamRespondingMessage([userMessage]);

    // 添加到历史消息列表，以便在按上方向键时显示
    addMessageSentToHistory(userMessage.content)
    // 清空输入框
    setMessage('');

    // 设置机器人正在请求
    setRobotIsRequesting(true);
    // 构造机器人发出的消息
    let replyMessage = { type: 'ai', content: "" };
    let streamChunk = {};
    // 创建一个新的 AbortController
    const newController = new AbortController();
    setController(newController);
    try {
      // 发送请求
      await replyFromBot(
        userMessage.content,
        (finalContent) => {
          setStreamRespondingMessage([]);
          replyMessage.content = finalContent;
          setMessages([...messages, userMessage, replyMessage]);
        },
        (content) => {
          replyMessage.content = content;
          setStreamRespondingMessage([userMessage, replyMessage]);
        },
        "chat-auto",
      )
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch request has been aborted");
      } else {
        console.error(error);
      }
      throw(error)
    } finally {
      setRobotIsRequesting(false);
      setController(null);
    }
  };

  return (
    <div className={className}>
      <style>
        {`
        .message-sender {
          display: grid;
          grid-template-rows: auto auto;
          grid-template-columns: 1fr auto;
          gap: 10px;
          padding: 10px;
          background-color: #f8f8f8;
        }

        .message-sender button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #4CAF50;
          color: white;
          cursor: pointer;
        }

        .message-sender button:hover {
          background-color: #45a049;
        }

        .robot-thinking {
          grid-column: span 2;
        }
      `}
      </style>

      <div className='message-sender'>
        <div className='robot-thinking'>{thinking + '.'.repeat(dots)}</div>
        <AutosizeTextarea
          value={message}
          placeholder='询问 文成公主 - GPT4'
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            margin: '0px 15px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'none',
            maxHeight: '400px'
          }}
        />
        {
          robotIsRequesting ? (
            <button onClick={handleCancelRequest} >
              <FaRegStopCircle />
            </button>
          ) : (
            <button onClick={handleSendClick} >
              <FaPaperPlane />
            </button>
          )
        }
      </div>
    </div>
  );
}

export default ChatMessageSender;