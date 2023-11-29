import React, { useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from 'styles/components/ui/Dropdown.module.css';

const Dropdown = ({ selected, setSelected, options, optionsEnum, width }: any) => {
  const style = width ? { width: width } : undefined;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<any>();

  if (optionsEnum) {
    options = [];
    for (const [, value] of Object.entries(optionsEnum)) {
      options.push({ text: value, value: value });
    }
  }

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
        className={`${styles['dropdown__button']} svg-container`}
        style={style}
        onClick={() => toggleOpen()}
      >
        <div className={styles['dropdown__button-content']}>
          <div className={styles['dropdown__button-text']}>{selected.text}</div>
          <FaChevronDown />
        </div>
      </button>
      {open && (
        <div className={styles['dropdown__list']}>
          {options.map((item: any, index: any) => (
            <button
              className={styles['dropdown__item']}
              style={style}
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
