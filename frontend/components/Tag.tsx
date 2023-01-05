import React from 'react';
import styles from '../styles/components/Tag.module.css';

const Tag = ({ tag, onClick, style }: any) => {
  return (
    <div
      className={`${style != undefined ? style + ' ' : ''}${styles.tag}`}
      onClick={() => {
        onClick && onClick(tag.tagName);
      }}
    >
      {tag.tagName}
    </div>
  );
};

export default Tag;
