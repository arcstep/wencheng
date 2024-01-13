import React, { useState, useEffect } from 'react';
import AutosizeTextarea from 'react-autosize-textarea';
import { FaPaperPlane, FaRegStopCircle } from 'react-icons/fa';
import { replyFromBot } from '../../api/robot';

function ChatMessageSender({ className, setMessages, messageSentHistory, addMessageSentToHistory }) {
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
    
    // 创建一个新的消息对象
    const newMessage = {
      id: Date.now(),
      timestamp: Date.now(),
      senderName: '你',
      senderIcon: "/images/you.jpeg",
      text: message,
      quotes: []
    };

    // 使用setMessages函数来更新消息
    setMessages(prevMessages => [...prevMessages, newMessage]);

    // 清空输入框
    setMessage('');

    // 机器人回复
    let replyMessage = {
      id: Date.now() + 1,
      timestamp: Date.now(),
      senderName: '文成公主',
      senderIcon: "/images/wencheng.png",
      text: "",
      quotes: []
    };

    // 使用setMessages函数来更新消息
    // console.log("replyMessage.text", replyMessage.text)
    setMessages(prevMessages => [...prevMessages, replyMessage]);
    // 每次请求发生时，都记录一下当前的请求状态
    setRobotIsRequesting(true);

    try {
      const newController = new AbortController();
      setController(newController);
      // 发送请求
      const { reader, contentType } = await replyFromBot(newMessage.text, newController.signal);
      addMessageSentToHistory(newMessage.text)
      // 创建一个解码器
      const decoder = new TextDecoder('utf-8');
      // 读取并处理数据块
      reader.read().then(function processText({ done, value }) {
        if (newController.signal.aborted || done) {
          console.log("Fetch request has been aborted")
          return;
        }
        // 解码数据块
        const chunk = decoder.decode(value);
        // 根据 Content-Type 处理数据块
        if (contentType.includes("application/json")) {
          // 如果数据块是 JSON，解析它并添加到消息的文本中
          replyMessage.text += JSON.parse(chunk);
        } else if (contentType.includes("text/plain") || contentType.includes("text/markdown")) {
          // 如果数据块是纯文本或 Markdown，直接添加到消息的文本中
          replyMessage.text += chunk;
        }
        // 更新消息列表
        setMessages(prevMessages => prevMessages.map(message => message.id === replyMessage.id ? { ...message, text: replyMessage.text } : message));
        // 继续读取下一个数据块
        return reader.read().then(processText);
      }).catch(error => {
        if (error.name === "AbortError") {
          console.log("Fetch request has been aborted");
        } else {
          console.error(error);
        }
      }).finally(() => {
        setRobotIsRequesting(false);
      });
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch request has been aborted");
      } else {
        console.error(error);
      }
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