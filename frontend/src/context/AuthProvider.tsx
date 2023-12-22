import React, { createContext, Dispatch, ReactNode, useState } from 'react';

export interface Auth {
  accessToken?: string;
  username?: string;
}

interface AuthContext {
  auth: Auth;
  setAuth: Dispatch<Auth>;
  isLoggedIn(): boolean;
}

const AuthContext = createContext<Partial<AuthContext>>({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>({});

  const isLoggedIn = (): boolean => {
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
