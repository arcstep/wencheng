// Toolbar.jsx
import React from 'react';
import { FaListUl, FaListOl, FaCode } from 'react-icons/fa';
import { EditorState, RichUtils } from 'draft-js';

export default function Toolbar({ className, editor, editorState, setEditorState }) {
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
    setEditorState(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    );
    focusEditor();
  }

  function toggleInlineStyle(inlineStyle) {
    const selection = editorState.getSelection();
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);

    console.log('Selection start:', selection.getStartOffset());
    console.log('Selection end:', selection.getEndOffset());

    setEditorState(EditorState.forceSelection(newState, selection));
    focusEditor();
  }

  const toggleH6 = (event) => {
    // Prevent the default mousedown event behavior
    event.preventDefault();

    // Toggle the H6 style
    const newEditorState = RichUtils.toggleBlockType(editorState, 'header-six');
    setEditorState(newEditorState);
    focusEditor();
  };

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
      {blockTypes.map((type) =>
        <button
          key={type.style}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBlockType(type.style);
          }}
          className={RichUtils.getCurrentBlockType(editorState) === type.style ? 'active' : ''}
        >
          {type.label}
        </button>
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

      <button onMouseDown={toggleH6}>H6-M</button>
      <button onClick={toggleH6}>H6</button>
      <button onMouseDown={printText}>Print Text</button>

    </div>
  );
}
