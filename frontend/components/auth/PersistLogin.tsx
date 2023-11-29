import useAuth from 'hooks/useAuth';
import useRefreshToken from 'hooks/useRefreshToken';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        // Ignore error
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  return <>{isLoading ? null : <Outlet />}</>;
};

export default PersistLogin;
