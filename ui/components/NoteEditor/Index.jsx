import React, { useEffect } from 'react';
import { Editor, ContentState, EditorState, RichUtils, EditorBlock, Modifier } from 'draft-js';
import TableOfContents from './TableOfContents';
import Toolbar from './Toolbar';
import "draft-js/dist/Draft.css";
import { stateFromHTML } from 'draft-js-import-html'; // 用于将 HTML 文本转换为 Draft.js 的 ContentState 对象
import { marked } from 'marked';
import styles from './Index.module.css';

export default function TextEditor({className, style, editorState, setEditorState}) {
  const editor = React.useRef(null);

  const onChange = (newEditorState) => {
    // console.log('onChange: ', newEditorState)
    setEditorState(newEditorState);
  };

  useEffect(() => {
    if (editor.current) {
      editor.current.focus();
    }
  }, []); // 当 editorState 更新时，执行 focus

  const blockRendererFn = (block) => {
    return {
      component: (props) => {
        return <div data-key={props.block.getKey()}><EditorBlock {...props} /></div>;
      },
      props: {
        className: 'editor-block',
      },
      editable: true,
    };
  }

  function focusEditor() {
    if (editor.current) {
      editor.current.focus();
    }
  }

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  function isMarkdown(text) {
    // 检查是否包含 Markdown 的标题、列表、链接等语法元素
    const regex = /(^# [^\n]+)|(\* [^\n]+)|(\[.+\]\(.+\))/g;
    return regex.test(text);
  }

  function handlePastedText(text, html, editorState) {
    let contentState = editorState.getCurrentContent();
    // 检查剪贴板中的数据类型
    let htmlText = html;
    console.log("handlePastedText:\ntext > ", text, "\n\nhtml > ", html)
    if (typeof text !== 'undefined' && text && (typeof html === 'undefined' || isMarkdown(text))) {
      htmlText = marked(text);
    }
    
    contentState = stateFromHTML(htmlText);

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

    // 阻止 Draft.js 的默认粘贴处理
    return 'handled';
  }

  return (
    <div className={`${className} ${styles["editor-container"]}`}>
      <Toolbar
        className={styles["editor-toolbar"]}
        editor={editor}
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <div className={styles.editor} onClick={focusEditor}>
        <Editor
          blockRendererFn={blockRendererFn}
          ref={editor}
          editor={editor}
          editorState={editorState}
          onChange={onChange}
          handlePastedText={handlePastedText}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
      {/* <TableOfContents
        className={styles["table-of-contents"]}
        editor={editor}
        editorState={editorState}
        setEditorState={setEditorState}
      /> */}
    </div>
  );
}