import React, { MouseEventHandler } from 'react';
import { FiMenu } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import UserDropdown from 'src/components/ui/UserDropdown';
import useAuth from 'src/hooks/useAuth';
import styles from 'styles/components/ui/Navbar.module.css';

interface NavbarProps {
  toggleNavPanel: MouseEventHandler;
}

const Navbar = ({ toggleNavPanel }: NavbarProps) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return (
    <nav className={styles.navbar} data-testid='navbar'>
      <div className={styles['navbar__left-container']}>
        <div
          className={`${styles['navbar__nav-panel-icon']} svg-container`}
          data-testid='navbar__nav-panel-icon'
          onClick={toggleNavPanel}
        >
          <FiMenu color='white' size={25} />
        </div>
        <Link to='/'>LeetList</Link>
      </div>
      {isLoggedIn?.() ? (
        <UserDropdown />
      ) : (
        <div className={styles['navbar__login-container']}>
          <Link to='/login' state={{ from: location }}>
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
