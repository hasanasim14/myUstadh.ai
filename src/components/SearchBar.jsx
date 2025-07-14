import React from 'react';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="searchbar-container">
      <input
        type="text"
        className="search-input"
        placeholder="What do you want to learn?"
      />
    </div>
  );
};

export default SearchBar;
