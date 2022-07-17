import React from 'react';
import Tag from './Tag';

const TagList = ({ tags }: any) => {
  return (
    <div className='tag-list'>
      {tags.map((tag: any, index: number) => {
        return <Tag key={index} tag={tag} />;
      })}
    </div>
  );
};

export default TagList;
