import React from 'react';
import LoginForm from 'src/pages/Login/Component/LoginForm';
import styles from 'styles/pages/Login/Login.module.css';

const Login = () => {
  return (
    <div className={styles.login}>
      <LoginForm />
    </div>
  );
};

export default Login;
