import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    navigate(0);
    setAuth({});
    window.localStorage.setItem('logout', Date.now().toString());
    await axios.get('/api/logout', { withCredentials: true });
  };
  return logout;
};

export default useLogout;
