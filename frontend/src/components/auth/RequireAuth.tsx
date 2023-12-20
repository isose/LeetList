import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';

const RequireAuth = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return isLoggedIn() ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />;
};

export default RequireAuth;
