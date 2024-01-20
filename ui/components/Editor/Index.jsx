import React, { useState } from 'react';
import NoteEditor from '../NoteEditor/Index';
import styles from './Index.module.css';
import { ContentState, ContentBlock, genKey, EditorState, Modifier } from 'draft-js';

const GridComponent = () => {
  const handleSelectFile = (path) => {
    setCurrentPath(path);
  };

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
  const contentState = ContentState.createFromBlockArray(blocks);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));

  const handleInsertText = (text) => {
    let htmlText = marked(text);
    let contentState = stateFromHTML(htmlText);

    // 如果当前的 EditorState 对象中没有内容块，则使用 ContentState.createFromText 方法创建一个新的 ContentState 对象
    if (typeof contentState.getBlockMap !== 'function') {
      contentState = ContentState.createFromText(text);
    }

    // 使用 Modifier.replaceWithFragment 方法将新的 ContentState 对象合并到当前的 EditorState 中
    const selectionState = editorState.getSelection();
    const newContentState = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      selectionState,
      contentState.getBlockMap()
    );

    // 创建新的 EditorState 对象
    const newEditorState = EditorState.push(editorState, newContentState, 'insert-fragment');
    setEditorState(newEditorState);
  };

  return (
    <div className={styles['flex-container']}>
      <div className={styles.left}>
        <NoteEditor
          editorState={editorState}
          setEditorState={setEditorState}
        />
      </div>
      <div className={styles.right}>Right Side</div>
    </div>
  );
};

export default GridComponent;