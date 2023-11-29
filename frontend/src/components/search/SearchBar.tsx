import React from 'react';

const SearchBar = ({ input, setInput, placeholder, style }: any) => {
  return (
    <input
      className={`search-bar${style !== undefined ? ' ' + style : ''}`}
      placeholder={placeholder}
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
};

export default SearchBar;
