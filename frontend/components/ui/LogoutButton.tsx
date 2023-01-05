import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import styles from '../../styles/components/ui/LogoutButton.module.css';

const LogoutButton = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <button
      className={styles['logout-button']}
      onClick={async () => {
        await logout();
        navigate('/');
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
