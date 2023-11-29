import axios from 'api/axios';
import useAuth from 'hooks/useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/api/refreshToken', { withCredentials: true });
    setAuth((prev: any) => {
      return { ...prev, username: response.data.username, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
