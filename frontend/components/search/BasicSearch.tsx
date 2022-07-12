import React from 'react';
import DifficultyDropdown from './DifficultyDropdown';
import SearchBar from './SearchBar';

const BasicSearch = ({ search, setSearch, difficultySelected, setDifficultySelected }: any) => {
  return (
    <div className='basic-search-wrapper'>
      <SearchBar input={search} setInput={setSearch} />
      <DifficultyDropdown selected={difficultySelected} setSelected={setDifficultySelected} />
    </div>
  );
};

export default BasicSearch;
