import React from 'react';
import DifficultyDropdown from './DifficultyDropdown';
import SearchBar from './SearchBar';
import TagsDropdown from './TagsDropdown';

const BasicSearch = ({
  search,
  setSearch,
  tagsSelected,
  setTagsSelected,
  difficultySelected,
  setDifficultySelected,
}: any) => {
  return (
    <div className='basic-search-wrapper'>
      <SearchBar input={search} setInput={setSearch} />
      <TagsDropdown selected={tagsSelected} setSelected={setTagsSelected} />
      <DifficultyDropdown selected={difficultySelected} setSelected={setDifficultySelected} />
    </div>
  );
};

export default BasicSearch;
