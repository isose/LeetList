import React, { Dispatch } from 'react';
import DifficultyDropdown from 'src/components/search/DifficultyDropdown';
import SearchBar from 'src/components/search/SearchBar';
import TagsDropdown from 'src/components/search/TagsDropdown';
import styles from 'styles/components/search/BasicSearch.module.css';

interface BasicSearchProps {
  search: string;
  setSearch: Dispatch<string>;
  tagsSelected: string[];
  setTagsSelected: Dispatch<string[]>;
  difficultySelected: string[];
  setDifficultySelected: Dispatch<string[]>;
}

const BasicSearch = ({
  search,
  setSearch,
  tagsSelected,
  setTagsSelected,
  difficultySelected,
  setDifficultySelected,
}: BasicSearchProps) => {
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
