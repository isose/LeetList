import React from 'react';

const UiButton = ({ className, text, onClick }: any) => {
  return (
    <button className={className} onClick={() => onClick && onClick()}>
      {text}
    </button>
  );
};

export default UiButton;
