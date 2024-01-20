import React, { useEffect } from 'react';
import { Editor, ContentState, EditorState, RichUtils, EditorBlock, Modifier } from 'draft-js';
import TableOfContents from './TableOfContents';
import Toolbar from './Toolbar';
import "draft-js/dist/Draft.css";
import { stateFromHTML } from 'draft-js-import-html'; // 用于将 HTML 文本转换为 Draft.js 的 ContentState 对象
import { marked } from 'marked';

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
    <div className={`${className} editor-container`}>
      <style>
        {`
        .editor-container {
          display: grid;
          grid-template-rows: 3em auto;
          grid-template-columns: 1fr;
          margin-left: 5px;
          height: 100%;
          background-color: #f5f5f5;
        }

        .editor-toolbar {
          grid-row: 1;
          grid-column: 1 / span 2;
          align-self: start;

          margin: 5px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }

        .editor {
          grid-row: 2;
          grid-column: 1;

          margin: 5px;
          padding: 0px 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          cursor: text;
          height: calc(100% - 30px);
          overflow: auto;
          background-color: #fff;
        }

        .table-of-contents {
          grid-row: 2;
          grid-column: 2;
          margin: 5px;
          height: calc(100% - 30px);
          overflow: auto;
          padding: 0px 5px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }
      `}
      </style>
      <Toolbar
        className={"editor-toolbar"}
        editor={editor}
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <div className="editor" onClick={focusEditor}>
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
        className="table-of-contents"
        editor={editor}
        editorState={editorState}
        setEditorState={setEditorState}
      /> */}
    </div>
  );
}