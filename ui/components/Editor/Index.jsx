import React, { useState } from 'react';
import DraftEditor from './DraftEditor';
import styles from './Index.module.css';
import { ContentState, ContentBlock, genKey, EditorState } from 'draft-js';
import TableOfContents from './TableOfContents';
import Toolbar from './Toolbar';

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
  const contentState = ContentState.createFromBlockArray(blocks);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));

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
      />
      <DraftEditor
        className={styles["editor"]}
        editor={editor}
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <div className={styles["vars"]}>Vars</div>
      <div className={styles["var-editor"]}>Var Editor</div>
    </div>
  );
};

export default Editor;