import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import UserDropdown from './UserDropdown';

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  return (
    <nav className='navbar'>
      <Link to='/'>Leetlist</Link>
      {isLoggedIn() ? (
        <UserDropdown />
      ) : (
        <div className='login-container'>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
