import React, { Dispatch, useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import styles from 'styles/components/search/DifficultyDropdown.module.css';

interface DifficultyDropdownProps {
  selected: string[];
  setSelected: Dispatch<string[]>;
}

const DifficultyDropdown = ({ selected, setSelected }: DifficultyDropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const difficultyDropdown = useRef<HTMLDivElement>(null);
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const toggleState = () => setOpen(!open);

  const clickOutside = (e: MouseEvent) => {
    if (
      open &&
      difficultyDropdown.current &&
      !difficultyDropdown.current.contains(e.target as HTMLDivElement)
    ) {
      setOpen(false);
    }
  };

  const handleClick = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((difficulty: string) => item !== difficulty));
    } else {
      setSelected([...selected, item]);
    }
  };

  document.addEventListener('mousedown', clickOutside);

  const isSelected = (item: string) => {
    return selected.includes(item);
  };

  return (
    <div ref={difficultyDropdown}>
      <button className={styles['difficulty-dropdown']} onClick={() => toggleState()}>
        Difficulty
      </button>
      {open && (
        <div className={styles['difficulty-dropdown__list']}>
          {difficulties.map((item: string, index: number) => (
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
