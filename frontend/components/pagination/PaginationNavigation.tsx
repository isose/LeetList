import React from 'react';
import PaginationDropdown from './PaginationDropdown';

const PaginationNavigation = ({ items, selected, onClick }: any) => {
  return (
    <div>
      <PaginationDropdown items={items} selected={selected} onClick={onClick} />
    </div>
  );
};

export default PaginationNavigation;
