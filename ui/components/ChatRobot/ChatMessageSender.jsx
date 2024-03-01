import React, { useState, useEffect } from 'react';
import AutosizeTextarea from 'react-autosize-textarea';
import { FaPaperPlane, FaRegStopCircle } from 'react-icons/fa';
import { replyFromBot } from '../../api/robot';
import styles from './ChatMessageSender.module.css';

function ChatMessageSender({ className, chatSessionId, apiAgent, messages, setMessages, setStreamRespondingMessage, messageSentHistory, addMessageSentToHistory }) {
  const [message, setMessage] = useState('');
  const [robotIsRequesting, setRobotIsRequesting] = useState(false);
  const [controller, setController] = useState(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [thinking, setThinking] = useState('');
  const [dots, setDots] = useState(0);
  const [robot_action, setRobotAction] = useState("chat_stream");

  const handleSelectChange = (event) => {
    setRobotAction(event.target.value);
  };

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
    const userMessage = { type: '你', content: message };
    setStreamRespondingMessage([userMessage]);

    // 添加到历史消息列表，以便在按上方向键时显示
    addMessageSentToHistory(userMessage.content)
    // 清空输入框
    setMessage('');

    // 设置机器人正在请求
    setRobotIsRequesting(true);
    // 构造机器人发出的消息
    let replyMessage = { type: 'AI', content: "" };
    // 创建一个新的 AbortController
    const newController = new AbortController();
    setController(newController);
    try {
      // 发送请求
      console.log("init content: ", replyMessage.content);
      await replyFromBot(
        userMessage.content,
        // 流文本结束后
        () => {
          setStreamRespondingMessage([]);
          console.log("reply from robot(final): ", replyMessage)
          setMessages([...messages, userMessage, replyMessage]);
        },
        // 流文本增量处理
        (content) => {
          // 可以使用join("|")来调试流式效果
          replyMessage.content = [replyMessage.content, content].join("");
          console.log("reply from robot: ", replyMessage.content)
          setStreamRespondingMessage([userMessage, replyMessage]);
        },
        apiAgent,
        controller,
        chatSessionId
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
      <div className={styles.container}>
        <div className={styles['robot-thinking']}>{thinking + '.'.repeat(dots)}</div>
        <AutosizeTextarea
          className={styles['message-input']}
          value={message}
          placeholder='请写出你的问题...'
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
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