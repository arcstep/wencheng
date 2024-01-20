import { EditorBlock } from 'draft-js';
import { use } from 'marked';
import { useState } from 'react';

const BlockVarText = (props) => {
  const [varText, setVarText] = useState('这是一个文本变量');

  return (
    <div data-key={props.block.getKey()} style={{ margin: '10px', padding: '10px', border: '1px solid green' }}>
      <EditorBlock {...props} />
      <div style={{
        border: '1px solid #ccc',
        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
        padding: '5px',
        margin: '5px 5px',
        backgroundColor: '#f9f9f9'
      }}>
        {varText}
      </div>
  </div>
  );
};

export {
  BlockVarText,
};