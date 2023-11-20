import React, { useState } from 'react';
import ModalContainer from './ModalContainer';

const ButtonModal = ({ children, text, style }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={style} onClick={() => setOpen(!open)}>
        {text}
      </button>
      <ModalContainer open={open} setOpen={setOpen}>
        {children}
      </ModalContainer>
    </>
  );
};

export default ButtonModal;
