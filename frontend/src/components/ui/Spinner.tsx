import React from 'react';
import styles from 'styles/components/ui/Spinner.module.css';

const Spinner = () => {
  return (
    <div className={styles['spinner__container']}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spinner;
