import React from 'react';

const SearchBar = ({ input, setInput }: any) => {
  return (
    <input
      className='search-bar'
      placeholder='Search questions'
      value={input}
      onInput={(e) => setInput((e.target as HTMLInputElement).value)}
    />
  );
};

export default SearchBar;
