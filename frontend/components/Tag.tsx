import React from 'react';

const Tag = ({ tag, onClick, styleName }: any) => {
  return (
    <div
      className={`tag${styleName || ''}`}
      onClick={() => {
        onClick && onClick(tag.tagName);
      }}
    >
      {tag.tagName}
    </div>
  );
};

export default Tag;
