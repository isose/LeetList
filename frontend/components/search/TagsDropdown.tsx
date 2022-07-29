import React, { useEffect, useRef, useState } from 'react';
import axios from '../../api/axios';
import Tag from '../Tag';

const TagsDropdown = ({ selected, setSelected }: any) => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    getTags();
  }, []);

  const tagsDropdown = useRef<any>();

  const getTags = async () => {
    const res = await axios.get('/api/tags');
    setTags(res.data);
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
    return selected.includes(tag.tagName) ? ' selected' : '';
  };

  document.addEventListener('mousedown', clickOutside);

  return (
    <div className='tags-dropdown-wrapper' ref={tagsDropdown}>
      <button className='tags-dropdown-button' onClick={() => toggleState()}>
        Tags
      </button>
      {open && (
        <div className='tags-dropdown-container'>
          <div className='tags-dropdown-header'>
            <input
              className='search-bar'
              placeholder='Filter tags'
              value={tagFilter}
              onInput={(e) => setTagFilter((e.target as HTMLInputElement).value)}
            />
          </div>
          <div className='tag-list'>
            {tags
              .filter((tag: any) => {
                return tag.tagName.toLowerCase().indexOf(tagFilter.toLowerCase()) !== -1;
              })
              .map((tag: any, index: number) => {
                return (
                  <Tag key={index} tag={tag} onClick={handleClick} styleName={getStyleName(tag)} />
                );
              })}
          </div>
          <div className='tags-dropdown-footer'>
            <button className='reset-tags-button' onClick={() => setSelected([])}>
              Reset Tags
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsDropdown;
