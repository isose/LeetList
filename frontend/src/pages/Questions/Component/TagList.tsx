import React, { useEffect, useRef, useState } from 'react';
import Tag from 'src/pages/Questions/Component/Tag';
import styles from 'styles/pages/Questions/Component/TagList.module.css';

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

  const handleClick = (e: any) => {
    e.stopPropagation();
    setExpanded(true);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles['tag-list']}${expanded ? ' ' + styles['tag-list--expanded'] : ''}`}
        ref={elementRef}
      >
        {tags.map((tag: any, index: number) => {
          return <Tag key={index} tag={tag} />;
        })}
      </div>
      {isOverflowed && !expanded && (
        <span className={styles['tag-list__expand']} onClick={(e) => handleClick(e)}>
          more
        </span>
      )}
    </div>
  );
};

export default TagList;
