// Toolbar.jsx
import React from 'react';
import { FaListUl, FaListOl, FaCode } from 'react-icons/fa';
import { EditorState, RichUtils, Modifier, SelectionState } from 'draft-js';
import './Toolbar.module.css';

export default function Toolbar({ className, editor, editorState, setEditorState, setCurrentBlockType }) {
  const blockTypes = [
    {label: "H1", style: 'header-one'},
    {label: "H2", style: 'header-two'},
    {label: "H3", style: 'header-three'},
    {label: "H4", style: 'header-four'},
    {label: "H5", style: 'header-five'},
    {label: "H6", style: 'header-six'},
    {label: <FaListUl />, style: 'unordered-list-item'},
    {label: <FaListOl />, style: 'ordered-list-item'},
    {label: <FaCode />, style: 'code-block'},
    {label: '文本变量', style: 'var-text-block'},
  ];
  
  const inlineStyles = [
    {label: '加粗', style: 'BOLD'},
    {label: '下划线', style: 'UNDERLINE'},
  ];

  function focusEditor() {
    if (editor.current) {
      editor.current.focus();
    }
  }

  function toggleBlockType(blockType) {
    const currentBlockType = RichUtils.getCurrentBlockType(editorState);
    let newBlockType = blockType;

    if (currentBlockType === blockType) {
      newBlockType = 'unstyled';
    }

    // 更新当前块的类型
    setCurrentBlockType(newBlockType);

    // 更新 editorState
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    let newContentState = Modifier.setBlockType(
      contentState,
      selectionState,
      newBlockType
    );

    let newEditorState = EditorState.push(editorState, newContentState, 'change-block-type');

    // 强制选择当前的块
    newEditorState = EditorState.forceSelection(
      newEditorState,
      newEditorState.getSelection()
    );

    setEditorState(newEditorState);
    focusEditor();
  }

  function toggleInlineStyle(inlineStyle) {
    const selection = editorState.getSelection();
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);

    // console.log('Selection start:', selection.getStartOffset());
    // console.log('Selection end:', selection.getEndOffset());

    setEditorState(EditorState.forceSelection(newState, selection));
    focusEditor();
  }

  function printText() {
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
      console.log(block.getText());
    } else {
      const selectedText = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getText().slice(selection.getStartOffset(), selection.getEndOffset());
      console.log(selectedText);
    }
  }

  return (
    <div className={className}>
      <style>
        {`
          button {
            background: transparent;
            border: none;
            cursor: pointer;
          }
          button:hover {
            background: #eee;
          }
          button.active {
            background: #ddd;
            color: #333;
          }
        `}
      </style>
      {blockTypes.map((type) => {
          // console.log("type: ", type)
          // console.log(RichUtils.getCurrentBlockType(editorState))
          return <button
            key={type.style}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleBlockType(type.style);
            }}
            className={RichUtils.getCurrentBlockType(editorState) === type.style ? 'active' : ''}
          >
            {type.label}
          </button>
        }
      )}

      {inlineStyles.map((type) =>
        <button
          key={type.style}
          onMouseDown={(event) => {
            event.preventDefault(); // 阻止事件的默认行为
            toggleInlineStyle(type.style);
          }}
          className={editorState.getCurrentInlineStyle().has(type.style) ? 'active' : ''}
        >
          {type.label}
        </button>
      )}

      <button onMouseDown={printText}>Print Text</button>

    </div>
  );
}
