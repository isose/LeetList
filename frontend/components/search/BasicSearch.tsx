import React from 'react';
import DifficultyDropdown from './DifficultyDropdown';

const BasicSearch = ({ difficultySelected, setDifficultySelected }: any) => {
  return (
    <div className='basic-search-wrapper'>
      <DifficultyDropdown selected={difficultySelected} setSelected={setDifficultySelected} />
    </div>
  );
};

export default BasicSearch;
