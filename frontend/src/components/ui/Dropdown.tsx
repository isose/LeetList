import React, { Dispatch, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from 'styles/components/ui/Dropdown.module.css';

interface DropdownProps {
  selected: any;
  setSelected: Dispatch<any>;
  options?: any[];
  optionsEnum?: any;
  width: number;
  testid?: string;
}

const Dropdown = ({
  selected,
  setSelected,
  options,
  optionsEnum,
  width,
  testid = 'dropdown',
}: DropdownProps) => {
  const style = width ? { width: width } : undefined;
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (optionsEnum) {
    options = [];
    for (const [, value] of Object.entries(optionsEnum)) {
      options.push({ text: value, value: value });
    }
  }

  const toggleOpen = () => setOpen(!open);

  const clickOutside = (e: MouseEvent) => {
    if (open && dropdownRef.current && !dropdownRef.current.contains(e.target as HTMLDivElement)) {
      setOpen(false);
    }
  };

  const handleClick = (item: any) => {
    toggleOpen();
    setSelected(item);
  };

  document.addEventListener('mousedown', clickOutside);

  return (
    <div data-testid={testid} ref={dropdownRef}>
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
        <div className={styles['dropdown__list']} data-testid='dropdown__list'>
          {options?.map((item: any, index: number) => (
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
