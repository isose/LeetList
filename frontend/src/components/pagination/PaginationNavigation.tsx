import React, { Dispatch } from 'react';
import PaginationButtons from 'src/components/pagination/PaginationButtons';
import Dropdown from 'src/components/ui/Dropdown';
import styles from 'styles/components/pagination/PaginationNavigation.module.css';

interface PaginationNavigationProps {
  selected: { text: string; value: number };
  setLimit: Dispatch<number>;
  page: number;
  totalPages: number;
  setPage: Dispatch<number>;
}

const PaginationNavigation = ({
  selected,
  setLimit,
  page,
  totalPages,
  setPage,
}: PaginationNavigationProps) => {
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
