import React, { createContext, useState } from 'react';

interface IAuthContext {
  auth: any;
  setAuth?: any;
  isLoggedIn?: any;
}

const AuthContext = createContext<Partial<IAuthContext>>({});

export const AuthProvider = ({ children }: any) => {
  const [auth, setAuth] = useState<any>({});

  const isLoggedIn = () => {
    return auth.username !== undefined;
  };

  window.addEventListener('storage', (event) => {
    if (event.key === 'logout') {
      setAuth({});
    }
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoggedIn }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
