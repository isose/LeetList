import React from 'react';
import styles from '../../styles/components/modal/Modal.module.css';
import ModalContainer from './ModalContainer';

const ErrorModal = ({ open, setOpen }: any) => {
  return (
    <ModalContainer open={open} setOpen={setOpen}>
      <ErrorModalContents />
    </ModalContainer>
  );
};

const ErrorModalContents = ({ toggleOpen }: any) => {
  return (
    <div className={styles.modal}>
      <h2>Error</h2>
      <p>Something went wrong, please try again.</p>
      <div className={styles['modal__footer']}>
        <button className={styles.button} onClick={toggleOpen}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
