import { useNavigate } from 'react-router-dom';
import axios from 'src/api/axios';
import useAuth from 'src/hooks/useAuth';

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
