import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

const LogoutButton = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <button
      className='logout-button'
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
