import React from 'react';
import styles from 'styles/pages/Questions/Component/Tag.module.css';

const Tag = ({ tag, onClick, style }: any) => {
  return (
    <div
      className={`${styles.tag}${style !== undefined ? ' ' + style : ''}`}
      onClick={() => {
        onClick && onClick(tag.tagName);
      }}
    >
      {tag.tagName}
    </div>
  );
};

export default Tag;