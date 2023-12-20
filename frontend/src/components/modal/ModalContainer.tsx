import React, { useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import styles from 'styles/components/modal/ModalContainer.module.css';

const ModalContainer = ({ children, open, setOpen }: any) => {
  const modalRef = useRef<any>();

  const toggleOpen = () => {
    setOpen(!open);
  };

  const clickOutside = (e: any) => {
    if (open && modalRef.current && !modalRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  document.addEventListener('mousedown', clickOutside);

  return (
    <>
      {open && (
        <div className={styles.background}>
          <div className={styles['modal__container']} data-testid='modal__container' ref={modalRef}>
            <div className={styles['close-button']} data-testid='close-button' onClick={toggleOpen}>
              <IoClose size={25} />
            </div>
            {React.cloneElement(children, { toggleOpen })}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalContainer;
