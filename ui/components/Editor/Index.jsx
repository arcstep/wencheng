import React, { useState } from 'react';
import DraftEditor from './DraftEditor';
import styles from './Index.module.css';
import { ContentState, ContentBlock, genKey, EditorState } from 'draft-js';
import TableOfContents from './TableOfContents';
import Toolbar from './Toolbar';
import VarEditor from './VarEditor'

class VarText {
  constructor({ text }) {
    this.text = text;
  }
}

const Editor = () => {
  const editor = React.useRef(null);

  // 默认的笔记内容块
  const blocks = [
    new ContentBlock({
      key: genKey(),
      type: 'header-one',
      text: '标题1',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'header-two',
      text: '标题2',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: '你好，文成公主',
    }),
  ];

  // 默认的文本变量
  const [varTexts, setVarTexts] = useState({
    'abc': new VarText({ text: '这是一个文本变量1' }),
    '背景摘要': new VarText({ text: '这是一个文本变量2' }),
  })

  const contentState = ContentState.createFromBlockArray(blocks);
  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));

  const [currentBlockType, setCurrentBlockType] = useState('unstyled');
  const [currentBlockText, setCurrentBlockText] = useState('');

  const onChangeCurrentBlock = (blockType = null, blockText = null) => {
    if (blockText !== null && currentBlockText !== blockText) {
      setCurrentBlockText(blockText);
    }
    if (blockType !== null && currentBlockType !== blockType) {
      setCurrentBlockType(blockType);
    }
  }

  return (
    <div className={styles['grid-container']}>
      <TableOfContents
          className={styles["table-of-contents"]}
          editor={editor}
          editorState={editorState}
          setEditorState={setEditorState}
      />
      <Toolbar
        className={styles["toolbar"]}
        editor={editor}
        editorState={editorState}
        setEditorState={setEditorState}
        setCurrentBlockType={blockType => onChangeCurrentBlock(blockType, null)}
      />
      <DraftEditor
        className={styles["doc-editor"]}
        varTexts={varTexts}
        editor={editor}
        editorState={editorState}
        setEditorState={setEditorState}
        setCurrentBlock={onChangeCurrentBlock}
      />
      <div className={styles["vars"]}>
        变量文本<br/>
        动态生成文本<br/>
      </div>
      <VarEditor
        className={styles["var-editor"]}
        varTexts={varTexts}
        blockType={currentBlockType}
        blockText={currentBlockText}
      />
    </div>
  );
};

export default Editor;