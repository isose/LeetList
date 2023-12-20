import React from 'react';
import PaginationButtons from 'src/components/pagination/PaginationButtons';
import Dropdown from 'src/components/ui/Dropdown';
import styles from 'styles/components/pagination/PaginationNavigation.module.css';

const PaginationNavigation = ({ selected, setLimit, page, totalPages, setPage }: any) => {
  const PAGINATION_OPTIONS = [
    { text: '20 / page', value: 20 },
    { text: '50 / page', value: 50 },
    { text: '100 / page', value: 100 },
    { text: '200 / page', value: 200 },
  ];

  return (
    <div className={styles['pagination-navigation']}>
      <Dropdown
        testid='pagination-dropdown'
        selected={selected}
        setSelected={setLimit}
        options={PAGINATION_OPTIONS}
        width={110}
      />
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
