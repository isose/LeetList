import React from 'react';
import useLogout from 'src/hooks/useLogout';
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
