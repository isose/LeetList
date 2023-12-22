import React, { Dispatch, useEffect, useRef, useState } from 'react';
import axios from 'src/api/axios';
import Tag, { ITag } from 'src/pages/Questions/Component/Tag';
import styles from 'styles/components/search/TagsDropdown.module.css';

interface TagsDropdownProps {
  selected: string[];
  setSelected: Dispatch<string[]>;
}

const TagsDropdown = ({ selected, setSelected }: TagsDropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string>('');

  useEffect(() => {
    getTags();
  }, []);

  const tagsDropdown = useRef<HTMLDivElement>(null);

  const getTags = async () => {
    const res = await axios.get('/api/tags');
    setTags(res.data);
  };

  const toggleState = () => setOpen(!open);

  const clickOutside = (e: MouseEvent) => {
    if (
      open &&
      tagsDropdown.current &&
      !tagsDropdown.current.contains(e.target as HTMLDivElement)
    ) {
      setOpen(false);
    }
  };

  const handleClick = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((tag: string) => item !== tag));
    } else {
      setSelected([...selected, item]);
    }
  };

  const getStyle = (tag: ITag): string => {
    return selected.includes(tag.tagName) ? `${styles.tag} ${styles['tag--selected']}` : styles.tag;
  };

  document.addEventListener('mousedown', clickOutside);

  return (
    <div ref={tagsDropdown}>
      <button
        className={styles['tags-dropdown__button']}
        data-testid='tags-dropdown__button'
        onClick={() => toggleState()}
      >
        Tags
      </button>
      {open && (
        <div className={styles['tags-dropdown__container']} data-testid='tags-dropdown__container'>
          <div className={styles['tags-dropdown__header']}>
            <input
              className={`search-bar ${styles['tags-dropdown__search-bar']}`}
              placeholder='Filter tags'
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            />
          </div>
          <div className={styles['tag-list']} data-testid='tag-list'>
            {tags
              .filter((tag: any) => {
                return tag.tagName.toLowerCase().indexOf(tagFilter.toLowerCase()) !== -1;
              })
              .map((tag: any, index: number) => {
                return <Tag key={index} tag={tag} onClick={handleClick} style={getStyle(tag)} />;
              })}
          </div>
          <div className={styles['tags-dropdown__footer']}>
            <button
              className={styles['tags-dropdown__reset-tags-button']}
              onClick={() => setSelected([])}
            >
              Reset Tags
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsDropdown;
