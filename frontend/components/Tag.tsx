import React from 'react';

const Tag = ({ tag, onClick, styleName }: any) => {
  return (
    <div
      className={`tag${styleName || ''}`}
      onClick={() => {
        onClick && onClick(tag.tag);
      }}
    >
      {tag.tag}
    </div>
  );
};

export default Tag;
