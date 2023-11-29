import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'styles/pages/Error/Error.module.css';

const Error = ({ title, message, buttonText, path }: any) => {
  const navigate = useNavigate();

  return (
    <div className={styles['error']}>
      <div className={styles['error__container']}>
        <h1>{title}</h1>
        <p>{message}</p>
        <button
          onClick={() => {
            navigate(path);
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Error;
