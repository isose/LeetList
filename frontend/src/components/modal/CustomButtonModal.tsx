import React, { ReactNode, useState } from 'react';
import ModalContainer from 'src/components/modal/ModalContainer';

interface CustomButtonModalProps {
  button: ReactNode;
  buttonStyle?: string;
  modalContents: ReactNode;
  testid?: string;
}

const CustomButtonModal = ({
  button,
  buttonStyle,
  modalContents,
  testid,
}: CustomButtonModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className={buttonStyle} data-testid={testid} onClick={() => setOpen(!open)}>
        {button}
      </div>
      <ModalContainer open={open} setOpen={setOpen}>
        {modalContents}
      </ModalContainer>
    </>
  );
};

export default CustomButtonModal;
