import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/components/ui/Navbar.module.css';
import UserDropdown from './UserDropdown';

const Navbar = ({ toggleNavPanel }: any) => {
  const { isLoggedIn } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar__left-container']}>
        <div
          className={`${styles['navbar__nav-panel-icon']} svg-container`}
          onClick={toggleNavPanel}
        >
          <FiMenu color='white' size={25} />
        </div>
        <Link to='/'>Leetlist</Link>
      </div>
      {isLoggedIn() ? (
        <UserDropdown />
      ) : (
        <div className={styles['navbar__login-container']}>
          <Link to='/login'>Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
