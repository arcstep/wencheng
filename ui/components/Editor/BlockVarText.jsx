import React, { useState, useEffect } from 'react';
import { EditorBlock } from 'draft-js';

const BlockVarText = (props) => {
  const [varText, setVarText] = useState('');

  useEffect(() => {
    setVarText(props.varText);
  }, [props.varText]);

  const getVarStyle = () => {
    if (varText && varText.length > 0) {
      return {
        border: '1px solid green',
        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
        padding: '10px',
        margin: '10px',
        backgroundColor: '#f9f9f9'
      };
    } else {
      return {
        border: '1px solid red',
        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
        padding: '10px',
        margin: '10px',
        backgroundColor: '#f9f9f9'
      };
    }
  }

  return (
    <div data-key={props.block.getKey()} style={getVarStyle()}>
      <EditorBlock {...props} />
      {/* <div style={{
        border: '1px solid #ccc',
        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
        padding: '5px',
        margin: '5px 5px',
        backgroundColor: '#f9f9f9'
      }}>
        {varText}
      </div> */}
    </div>
  );
};

export {
  BlockVarText,
};