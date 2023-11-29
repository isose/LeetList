import DifficultyDropdown from 'components/search/DifficultyDropdown';
import SearchBar from 'components/search/SearchBar';
import TagsDropdown from 'components/search/TagsDropdown';
import React from 'react';
import styles from 'styles/components/search/BasicSearch.module.css';

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
      <SearchBar
        input={search}
        setInput={setSearch}
        placeholder='Search Questions'
        style={styles['basic-search__search-bar']}
      />
      <TagsDropdown selected={tagsSelected} setSelected={setTagsSelected} />
      <DifficultyDropdown selected={difficultySelected} setSelected={setDifficultySelected} />
    </div>
  );
};

export default BasicSearch;
