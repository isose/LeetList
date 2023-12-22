import React from 'react';

interface UiButtonProps {
  className: string;
  testid?: string;
  text?: string | number;
  onClick?: any;
}

const UiButton = ({ className, testid, text, onClick }: UiButtonProps) => {
  return (
    <button className={className} data-testid={testid} onClick={() => onClick && onClick()}>
      {text}
    </button>
  );
};

export default UiButton;
