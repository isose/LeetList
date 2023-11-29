import useAuth from 'hooks/useAuth';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const LoggedInRedirect = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn() ? <Navigate to='/' replace /> : <Outlet />;
};

export default LoggedInRedirect;
