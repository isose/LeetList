import React from 'react';

const SearchBar = ({ input, setInput, style }: any) => {
  return (
    <input
      className={`search-bar${style !== undefined ? ' ' + style : ''}`}
      placeholder='Search questions'
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
};

export default SearchBar;
