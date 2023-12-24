import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import Tag, { ITag } from 'src/pages/Questions/Component/Tag';
import styles from 'styles/pages/Questions/Component/TagList.module.css';

interface TagListProps {
  tags: ITag[];
}

const TagList = ({ tags }: TagListProps) => {
  const [isOverflowed, setIsOverflowed] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const checkOverflow = () => {
    const overflow = elementRef!.current!.scrollHeight > elementRef!.current!.clientHeight;
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

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    setExpanded(true);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles['tag-list']}${expanded ? ' ' + styles['tag-list--expanded'] : ''}`}
        data-testid='tag-list'
        ref={elementRef}
      >
        {tags.map((tag: ITag, index: number) => {
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
