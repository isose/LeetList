import React, { Dispatch, ReactElement, ReactNode, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import styles from 'styles/components/modal/ModalContainer.module.css';

interface ModalContainerProps {
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<boolean>;
}

const ModalContainer = ({ children, open, setOpen }: ModalContainerProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const clickOutside = (e: MouseEvent) => {
    if (open && modalRef.current && !modalRef.current.contains(e.target as HTMLDivElement)) {
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
            {React.cloneElement(children as ReactElement, { toggleOpen })}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalContainer;
