import React, { useEffect, useRef, useState } from 'react';
import Tag from '../Tag';

const TagsDropdown = ({ selected, setSelected }: any) => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags();
  }, []);

  const tagsDropdown = useRef<any>();

  const getTags = async () => {
    const res = await fetch('/tags');
    const data = await res.json();
    setTags(data);
  };

  const toggleState = () => setOpen(!open);

  const clickOutside = (e: any) => {
    if (open && tagsDropdown.current && !tagsDropdown.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleClick = (item: any) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((tag: string) => item !== tag));
    } else {
      setSelected([...selected, item]);
    }
  };

  const getStyleName = (tag: any) => {
    return selected.includes(tag.tag) ? ' selected' : '';
  };

  document.addEventListener('mousedown', clickOutside);

  // TODO add tags to query
  // TODO add switch for logical AND or logical OR
  // TODO add clear tags button
  // TODO search bar for tags container
  // TODO scrollbar for tags container

  return (
    <div className='tags-dropdown-wrapper' ref={tagsDropdown}>
      <button className='tags-dropdown-header' onClick={() => toggleState()}>
        Tags
      </button>
      {open && (
        <div className='tags-dropdown-container tag-list'>
          {tags.map((tag: any, index: number) => {
            return (
              <Tag key={index} tag={tag} onClick={handleClick} styleName={getStyleName(tag)} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TagsDropdown;
