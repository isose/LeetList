import LoginForm from 'pages/Login/Component/LoginForm';
import React from 'react';
import styles from 'styles/pages/Login/Login.module.css';

const Login = () => {
  return (
    <div className={styles.login}>
      <LoginForm />
    </div>
  );
};

export default Login;
