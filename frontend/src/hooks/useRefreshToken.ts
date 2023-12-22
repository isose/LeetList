import axios from 'src/api/axios';
import useAuth from 'src/hooks/useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/api/refreshToken', { withCredentials: true });
    setAuth?.({ accessToken: response.data.accessToken, username: response.data.username });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
