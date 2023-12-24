import React, { ReactNode, useState } from 'react';
import ModalContainer from 'src/components/modal/ModalContainer';

interface ButtonModalProps {
  children: ReactNode;
  text: string;
  style?: string;
}

const ButtonModal = ({ children, text, style }: ButtonModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

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
