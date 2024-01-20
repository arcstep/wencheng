// TableOfContents.jsx
import React, {useState, useEffect} from 'react';
import { EditorState, SelectionState } from 'draft-js';
import styles from './TableOfContents.module.css';

export default function TableOfContents({ className, editor, editorState, setEditorState }) {
  const [tableOfContents, setTableOfContents] = useState([]);

  // 动态更新目录
  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const blocks = contentState.getBlockMap();
    const headingBlocks = blocks.filter(block => {
      const type = block.getType();
      return type.startsWith('header-');
    });
    const tableOfContents = headingBlocks.map(block => {
      const text = block.getText();
      const type = block.getType();
      // console.log(type);  // 打印标题的类型
      const levelString = type.split('-')[1];
      let level;
      switch (levelString) {
        case 'one':
          level = 1;
          break;
        case 'two':
          level = 2;
          break;
        case 'three':
          level = 3;
          break;
        // 添加更多的 case 以处理更多的层次
        default:
          level = 0;  // 如果 levelString 不是预期的值，那么 level 就设为 0
      }
      const key = block.getKey();
      console.log("key: ", key, "text: ", text, "level: ", level)
      return { text, level, key };
    }).toArray();
    setTableOfContents(tableOfContents);
  }, [editorState]);  

  // 处理目录条目的点击事件  
  function handleItemClick(key) {
    console.log("handleItemClick", key)
    const blockElement = document.querySelector(`[data-key="${key}"]`);
    if (blockElement) {
      blockElement.scrollIntoView({ behavior: 'instant' });    }
    const block = editorState.getCurrentContent().getBlockForKey(key);
    if (editor.current && block) {
      const blockLength = block.getLength();
      const selection = SelectionState.createEmpty(key).set('focusOffset', blockLength);
      const newEditorState = EditorState.forceSelection(editorState, selection);
      setEditorState(newEditorState);
    }
  }

  return (
    <div className={className}>
      <ul>
        {tableOfContents.map(item => {
          console.log("item.level: ", item.level); 
          return(
            <li key={item.key} onClick={() => handleItemClick(item.key)} style={{ paddingLeft: `${item.level - 1}em` }} >
              {item.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
