import { useContext } from 'react';
import AuthContext from 'src/context/AuthProvider';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
