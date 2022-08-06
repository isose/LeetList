import React, { useState } from 'react';

const Tooltip = ({ text, children, disabled }: any) => {
  let timeout: any;
  const [active, setActive] = useState(false);
  const [fadingIn, setfadingIn] = useState(true);

  const showTooltip = () => {
    timeout = setTimeout(() => {
      setfadingIn(true);
      setActive(true);
    }, 100);
  };

  const hideTooltip = () => {
    clearInterval(timeout);
    setfadingIn(false);
    timeout = setTimeout(() => {
      setActive(false);
    }, 150);
  };

  return (
    <div className='tooltip-wrapper' onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {active && !disabled && (
        <div className={`tooltip ${fadingIn ? 'tooltip-fadein' : 'tooltip-fadeout'}`}>{text}</div>
      )}
    </div>
  );
};

export default Tooltip;
