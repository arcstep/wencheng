import { EditorBlock, Modifier, EditorState } from 'draft-js';

const BlockVarText = (props) => {
  const handleClick = (event) => {
    console.log('handleClick: ', props.block.getText())
  };

  const varText = props.block.getData().get('varText', '这是一个文本变量');

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
        <button onMouseDown={handleClick}>修改文本变量</button>
      </div>
    </div>
  );
};

export {
  BlockVarText,
};