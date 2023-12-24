import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';

const LoggedInRedirect = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn?.() ? <Navigate to='/' replace /> : <Outlet />;
};

export default LoggedInRedirect;
