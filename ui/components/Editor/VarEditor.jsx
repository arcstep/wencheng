import React, { useRef, useState, useEffect } from 'react';
import AutosizeTextarea from 'react-autosize-textarea';
import styles from './VarEditor.module.css';

export default function TextEditor({className, varTexts, updateVarText, blockType, blockText}) {
  const getVarText = () => {
    console.log("varTexts: ", varTexts)
    if(blockType === "var-text-block" && blockText in varTexts) {
      return varTexts[blockText].text;
    } else {
      return null;
    }
  };

  const textareaRef = useRef();
  const [textareaValue, setTextareaValue] = useState(getVarText());

  // 使用 useEffect 在 varTexts 更新时更新 textarea 的值
  useEffect(() => {
    setTextareaValue(getVarText());
  }, [varTexts, getVarText()]);

  const submitForm = (event) => {
    event.preventDefault();
    const varText = textareaRef.current.value;
    updateVarText(blockText, varText);
  };

  return (
    <div className={className}>
      <div className={styles["container"]}>
        <form onSubmit={submitForm}>
          <div>「{blockText}」{blockType}</div>
          <div>
            <AutosizeTextarea
              className={styles['editor']}
              ref={textareaRef}
              value={textareaValue || ""}
              placeholder='请输入文本'
              onChange={e => setTextareaValue(e.target.value)}
            />
          </div>
        <input type="submit" value="更新" />
      </form>        
      </div>
    </div>
  );
}
