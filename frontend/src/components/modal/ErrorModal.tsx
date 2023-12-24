import React, { Dispatch, MouseEventHandler } from 'react';
import ModalContainer from 'src/components/modal/ModalContainer';
import styles from 'styles/components/modal/Modal.module.css';

interface ErrorModalProps {
  open: boolean;
  setOpen: Dispatch<boolean>;
}

const ErrorModal = ({ open, setOpen }: ErrorModalProps) => {
  return (
    <ModalContainer open={open} setOpen={setOpen}>
      <ErrorModalContents />
    </ModalContainer>
  );
};

interface ErrorModalContentsProps {
  toggleOpen?: MouseEventHandler;
}

const ErrorModalContents = ({ toggleOpen }: ErrorModalContentsProps) => {
  return (
    <div className={styles.modal}>
      <h2>Error</h2>
      <p>Something went wrong, please try again.</p>
      <div className={styles['modal__footer']}>
        <button className={styles.button} onClick={toggleOpen as MouseEventHandler}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
