import React, { useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from '../../styles/components/pagination/PaginationDropdown.module.css';

const PaginationDropdown = ({ selected, onClick }: any) => {
  const [open, setOpen] = useState(false);
  const paginationDropdown = useRef<any>();
  const DROPDOWN_TEXT = ' / page';
  const paginationOptions = [{ value: 20 }, { value: 50 }, { value: 100 }, { value: 200 }];

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
    <div ref={paginationDropdown}>
      <button
        className={`${styles['pagination-dropdown__header']} svg-container`}
        onClick={() => toggleState()}
      >
        {selected}
        {DROPDOWN_TEXT} <FaChevronDown />
      </button>
      {open && (
        <div className={styles['pagination-dropdown__list']}>
          {paginationOptions.map((item: any, index: any) => (
            <button
              className={styles['pagination-dropdown__item']}
              key={index}
              onClick={() => handleClick(item)}
            >
              {item.value}
              {DROPDOWN_TEXT}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaginationDropdown;
