import React from 'react';
import styles from '../../styles/components/pagination/PaginationButtons.module.css';
import UiButton from '../ui/UiButton';

const PaginationButtons = ({ page, totalPages, setPage, numberOfButtons }: any) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const currentPageCss = (pageNumber: number) => {
    return pageNumber == page ? ` ${styles['pagination-button--current']}` : '';
  };

  const buttonWindowSize = Math.min(numberOfButtons, Math.max(totalPages - 2, 0));
  const pageNumberOffset =
    Math.max(1 - page, -Math.ceil(buttonWindowSize / 2)) +
    Math.min(1, totalPages - (page + Math.floor(buttonWindowSize / 2)));

  const prevPageEllipses =
    numberOfButtons == buttonWindowSize && page - 1 > Math.ceil(buttonWindowSize / 2);
  const nextPageEllipses =
    numberOfButtons == buttonWindowSize && page + 1 < totalPages - Math.floor(buttonWindowSize / 2);

  return (
    <div className={styles.wrapper}>
      <UiButton
        className={styles['pagination-button']}
        text={'<'}
        onClick={() => goToPage(page - 1)}
      />
      <UiButton
        className={`${styles['pagination-button']}${currentPageCss(1)}`}
        text={'1'}
        onClick={() => goToPage(1)}
      />
      {prevPageEllipses && <UiButton className={styles['pagination-button']} text={'...'} />}
      {[...Array(buttonWindowSize)].map((_, i) => {
        const pageNumber = page + i + pageNumberOffset;
        return (
          <UiButton
            className={`${styles['pagination-button']}${currentPageCss(pageNumber)}`}
            key={i}
            text={pageNumber}
            onClick={() => goToPage(pageNumber)}
          />
        );
      })}
      {nextPageEllipses && <UiButton className={styles['pagination-button']} text={'...'} />}
      {totalPages > 1 && (
        <UiButton
          className={`${styles['pagination-button']}${currentPageCss(totalPages)}`}
          text={totalPages}
          onClick={() => goToPage(totalPages)}
        />
      )}
      <UiButton
        className={styles['pagination-button']}
        text={'>'}
        onClick={() => goToPage(page + 1)}
      />
    </div>
  );
};

export default PaginationButtons;
