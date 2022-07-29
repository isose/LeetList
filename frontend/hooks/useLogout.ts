import axios from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    await axios.get('/api/logout', { withCredentials: true });
  };
  return logout;
};

export default useLogout;
