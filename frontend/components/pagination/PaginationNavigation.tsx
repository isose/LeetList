import React from 'react';
import PaginationButtons from './PaginationButtons';
import PaginationDropdown from './PaginationDropdown';

const PaginationNavigation = ({ items, selected, setLimit, page, totalPages, setPage }: any) => {
  return (
    <div className='pagination-navigation'>
      <PaginationDropdown items={items} selected={selected} onClick={setLimit} />
      <PaginationButtons
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        numberOfButtons={5}
      />
    </div>
  );
};

export default PaginationNavigation;
