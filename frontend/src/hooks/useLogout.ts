import { useNavigate } from 'react-router-dom';
import axios from 'src/api/axios';
import useAuth from 'src/hooks/useAuth';

const useLogout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    setAuth({});
    window.localStorage.setItem('logout', Date.now().toString());
    await axios.get('/api/logout', { withCredentials: true });
    navigate(0);
  };
  return logout;
};

export default useLogout;
