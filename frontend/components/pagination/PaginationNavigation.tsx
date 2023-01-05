import React from 'react';
import styles from '../../styles/components/pagination/PaginationNavigation.module.css';
import PaginationButtons from './PaginationButtons';
import PaginationDropdown from './PaginationDropdown';

const PaginationNavigation = ({ selected, setLimit, page, totalPages, setPage }: any) => {
  return (
    <div className={styles['pagination-navigation']}>
      <PaginationDropdown selected={selected} onClick={setLimit} />
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
