import React from 'react';

const UiButton = ({ className, testid, text, onClick }: any) => {
  return (
    <button className={className} data-testid={testid} onClick={() => onClick && onClick()}>
      {text}
    </button>
  );
};

export default UiButton;
