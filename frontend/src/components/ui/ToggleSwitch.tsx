import React, { Dispatch } from 'react';
import styles from 'styles/components/ui/ToggleSwitch.module.css';

interface ToggleSwitchProps {
  style?: string;
  height?: number;
  value?: boolean;
  setValue: Dispatch<boolean>;
  label: string;
  onChange?: any;
}

const ToggleSwitch = ({ style, height, value, setValue, label, onChange }: ToggleSwitchProps) => {
  const handleOnChange = () => {
    value = !value;
    setValue(value);
    onChange && onChange(value);
  };

  const getHeight = (): { height: string } => {
    return { height: height !== undefined ? `${height}px` : '30px' };
  };

  return (
    <div className={`${styles.wrapper}${style !== undefined ? ' ' + style : ''}`}>
      <label style={getHeight()}>
        <input
          className={styles['toggle-checkbox']}
          type='checkbox'
          defaultChecked={value}
          onChange={handleOnChange}
        />
        <div className={styles['toggle-switch']} data-testid='toggle-switch' />
      </label>
      <span className={styles['toggle-label']} data-testid='toggle-label'>
        {label}
      </span>
    </div>
  );
};

export default ToggleSwitch;
