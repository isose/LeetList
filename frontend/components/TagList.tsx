import React, { useEffect, useRef, useState } from 'react';
import Tag from './Tag';

const TagList = ({ tags }: any) => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const elementRef = useRef<any>();

  const checkOverflow = () => {
    const overflow = elementRef.current.scrollHeight > elementRef.current.clientHeight;
    setIsOverflowed(overflow);
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
  }, []);

  useEffect(
    () => () => {
      window.removeEventListener('resize', checkOverflow);
    },
    [],
  );

  return (
    <div className='tag-list-wrapper'>
      <div className={`tag-list${expanded ? ' expanded' : ''}`} ref={elementRef}>
        {tags.map((tag: any, index: number) => {
          return <Tag key={index} tag={tag} />;
        })}
      </div>
      {isOverflowed && !expanded && (
        <span className='expand-tags' onClick={() => setExpanded(true)}>
          more
        </span>
      )}
    </div>
  );
};

export default TagList;
