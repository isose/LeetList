import React, { Dispatch } from 'react';

interface SearchBarProps {
  input: string;
  setInput: Dispatch<string>;
  placeholder: string;
  style?: string;
}

const SearchBar = ({ input, setInput, placeholder, style }: SearchBarProps) => {
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
