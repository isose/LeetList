import React from 'react';

const SearchBar = ({ input, setInput, style }: any) => {
  return (
    <input
      className={`search-bar${style != undefined ? ' ' + style : ''}`}
      placeholder='Search questions'
      value={input}
      onInput={(e) => setInput((e.target as HTMLInputElement).value)}
    />
  );
};

export default SearchBar;
