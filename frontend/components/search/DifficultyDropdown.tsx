import React, { useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import styles from '../../styles/components/search/DifficultyDropdown.module.css';

const DifficultyDropdown = ({ selected, setSelected }: any) => {
  const [open, setOpen] = useState(false);

  const difficultyDropdown = useRef<any>();
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const toggleState = () => setOpen(!open);

  const clickOutside = (e: any) => {
    if (open && difficultyDropdown.current && !difficultyDropdown.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleClick = (item: any) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((difficulty: string) => item !== difficulty));
    } else {
      setSelected([...selected, item]);
    }
  };

  document.addEventListener('mousedown', clickOutside);

  const isSelected = (item: any) => {
    return selected.includes(item);
  };

  return (
    <div ref={difficultyDropdown}>
      <button className={styles['difficulty-dropdown']} onClick={() => toggleState()}>
        Difficulty
      </button>
      {open && (
        <div className={styles['difficulty-dropdown__list']}>
          {difficulties.map((item: any, index: any) => (
            <button
              className={`${styles['difficulty-dropdown__item']} svg-container`}
              key={index}
              onClick={() => handleClick(item)}
            >
              {item}
              {isSelected(item) && <FaCheck />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DifficultyDropdown;
