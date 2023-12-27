import React, { ReactNode, useState } from 'react';
import ModalContainer from 'src/components/modal/ModalContainer';

interface SpanModalProps {
  children: ReactNode;
  text: string;
  style?: string;
}

const SpanModal = ({ children, text, style }: SpanModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <span className={style} onClick={() => setOpen(!open)}>
        {text}
      </span>
      <ModalContainer open={open} setOpen={setOpen}>
        {children}
      </ModalContainer>
    </>
  );
};

export default SpanModal;
