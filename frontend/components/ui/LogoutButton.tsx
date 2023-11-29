import useLogout from 'hooks/useLogout';
import React from 'react';
import styles from 'styles/components/ui/LogoutButton.module.css';

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <button
      className={styles['logout-button']}
      onClick={async () => {
        await logout();
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
