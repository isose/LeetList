import React, { createContext, useState } from 'react';

interface IAuthContext {
  auth: any;
  setAuth?: any;
}

const AuthContext = createContext<Partial<IAuthContext>>({});

export const AuthProvider = ({ children }: any) => {
  const [auth, setAuth] = useState({});

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
