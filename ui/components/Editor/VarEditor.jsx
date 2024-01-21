import React, { useEffect } from 'react';
import styles from './VarEditor.module.css';

export default function TextEditor({className, blockType, blockText, editor, editorState, setEditorState}) {
  return (
    <div className={className}>
      <div>
        blockType: {blockType}
      </div>
      <div className={styles["editor"]}>
        「{blockText}」
      </div>
    </div>
  );
}
