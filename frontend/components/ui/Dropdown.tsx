import React, { useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from '../../styles/components/ui/Dropdown.module.css';

const Dropdown = ({ selected, setSelected, options }: any) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<any>();

  const toggleOpen = () => setOpen(!open);

  const clickOutside = (e: any) => {
    if (open && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleClick = (item: any) => {
    toggleOpen();
    setSelected(item);
  };

  document.addEventListener('mousedown', clickOutside);

  return (
    <div ref={dropdownRef}>
      <button
        className={`${styles['dropdown__header']} svg-container`}
        onClick={() => toggleOpen()}
      >
        {selected.text} <FaChevronDown />
      </button>
      {open && (
        <div className={styles['dropdown__list']}>
          {options.map((item: any, index: any) => (
            <button
              className={styles['dropdown__item']}
              key={index}
              onClick={() => handleClick(item)}
            >
              {item.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
