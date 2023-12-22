import React from 'react';
import styles from 'styles/pages/Questions/Component/Tag.module.css';

export interface ITag {
  tagName: string;
}

interface TagProps {
  tag: ITag;
  onClick?: (item: string) => void;
  style?: string;
}

const Tag = ({ tag, onClick, style }: TagProps) => {
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
