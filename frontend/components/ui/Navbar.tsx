import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/components/ui/Navbar.module.css';
import UserDropdown from './UserDropdown';

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  return (
    <nav className={styles.navbar}>
      <Link to='/'>Leetlist</Link>
      {isLoggedIn() ? (
        <UserDropdown />
      ) : (
        <div className={styles['navbar__login-container']}>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
