import React, { useState } from 'react';
import styles from '../../styles/components/ui/Tooltip.module.css';

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
    <div className={styles.wrapper} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {active && !disabled && (
        <div
          className={`${styles.tooltip} ${
            fadingIn ? styles['tooltip--fadein'] : styles['tooltip--fadeout']
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
