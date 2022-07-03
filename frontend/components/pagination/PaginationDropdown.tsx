import React, { useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const PaginationDropdown = ({ items, selected, onClick }: any) => {
  const [open, setOpen] = useState(false);
  const paginationDropdown = useRef<any>();
  const DROPDOWN_TEXT = ' / page';

  const toggleState = () => setOpen(!open);

  const clickOutside = (e: any) => {
    if (open && paginationDropdown.current && !paginationDropdown.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleClick = (item: any) => {
    toggleState();
    onClick(item.value);
    localStorage.setItem('limit', JSON.stringify(item.value));
  };

  document.addEventListener('mousedown', clickOutside);

  return (
    <div className='pagination-dropdown-wrapper' ref={paginationDropdown}>
      <div className='pagination-dropdown-header svg-container' onClick={() => toggleState()}>
        {selected}
        {DROPDOWN_TEXT} <FaChevronDown />
      </div>
      {open && (
        <div className='pagination-dropdown-list'>
          {items.map((item: any, index: any) => (
            <div className='pagination-dropdown-item' key={index} onClick={() => handleClick(item)}>
              {item.value}
              {DROPDOWN_TEXT}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaginationDropdown;
