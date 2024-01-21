import React, { useEffect } from 'react';
import styles from './VarEditor.module.css';

export default function TextEditor({className, varTexts, blockType, blockText, editor, editorState, setEditorState}) {
  const getVarText = () => {
    if(blockText in varTexts) {
      return varTexts[blockText].text;
    } else {
      return null;
    }
  };
  console.log("varTexts: ", varTexts)
  return (
    <div className={className}>
      <div>
        {blockType}
      </div>
      <div className={styles["editor"]}>
        「{blockText}」
      </div>
      <div className={styles["editor"]}>
        「{getVarText()}」
      </div>
    </div>
  );
}
