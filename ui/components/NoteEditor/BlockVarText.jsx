import { EditorBlock } from 'draft-js';
import { useState, useEffect } from 'react';

const BlockVarText = (props) => {
  const [varName, setVarName] = useState("");

  useEffect(() => {
    const blockText = props.block.getText();
    setVarName(blockText.replace(/^@文本变量[ ]+/g, ''));
  }, [props.block]);

  return (
    <div data-key={props.block.getKey()} style={{ border: '1px solid green' }}>
      <EditorBlock {...props} />
      <div>{varName}</div>
  </div>
  );
};

export {
  BlockVarText,
};