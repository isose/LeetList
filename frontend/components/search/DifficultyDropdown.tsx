import React, { useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

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
    <div className='difficulty-dropdown-wrapper' ref={difficultyDropdown}>
      <button className='difficulty-dropdown-header' onClick={() => toggleState()}>
        Difficulty
      </button>
      {open && (
        <div className='difficulty-dropdown-list'>
          {difficulties.map((item: any, index: any) => (
            <button
              className='difficulty-dropdown-item svg-container'
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
