import React from 'react';
import Tag from './Tag';

const TagList = ({ tags }: any) => {
  return (
    <div>
      {tags.map((tag: any, index: number) => {
        return <Tag key={index} {...tag} />;
      })}
    </div>
  );
};

export default TagList;
