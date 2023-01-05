import React from 'react';
import styles from '../../styles/components/search/BasicSearch.module.css';
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
    <div className={styles.wrapper}>
      <SearchBar input={search} setInput={setSearch} style={styles['basic-search__search-bar']} />
      <TagsDropdown selected={tagsSelected} setSelected={setTagsSelected} />
      <DifficultyDropdown selected={difficultySelected} setSelected={setDifficultySelected} />
    </div>
  );
};

export default BasicSearch;
