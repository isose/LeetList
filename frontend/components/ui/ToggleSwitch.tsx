import React from 'react';
import styles from '../../styles/components/ui/ToggleSwitch.module.css';

const ToggleSwitch = ({ style, height, value, setValue, label, onChange }: any) => {
  const handleOnChange = () => {
    value = !value;
    setValue(value);
    onChange && onChange(value);
  };

  const getHeight = () => {
    return { height: height !== undefined ? `${height}px` : '30px' };
  };

  return (
    <div className={`${styles.wrapper}${style !== undefined ? ' ' + style : ''}`}>
      <label style={getHeight()}>
        <input
          className={styles['toggle-checkbox']}
          type='checkbox'
          value={value}
          defaultChecked={value}
          onChange={handleOnChange}
        />
        <div className={styles['toggle-switch']} />
      </label>
      <span className={styles['toggle-label']}>{label}</span>
    </div>
  );
};

export default ToggleSwitch;
