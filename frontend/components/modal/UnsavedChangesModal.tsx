import React from 'react';
import styles from '../../styles/components/modal/Modal.module.css';

const UnsavedChangesModal = ({ handleDiscard, toggleOpen }: any) => {
  return (
    <div className={styles.modal}>
      <h2>Unsaved changes</h2>
      <p>Any unsaved changes will be lost. Do you wish to discard unsaved changes?</p>
      <div className={styles['modal__footer']}>
        <button className={styles.button} onClick={handleDiscard}>
          Discard
        </button>
        <button className={styles.button} onClick={toggleOpen}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;
