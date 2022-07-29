import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location: any = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setUsernameError('');
  }, [username]);

  useEffect(() => {
    setPasswordError('');
  }, [password]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', JSON.stringify({ username, password }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const accessToken = response.data.accessToken;
      setAuth({ username, accessToken });
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err?.response) {
        const data = err.response.data;
        if (data.username) {
          setUsernameError(data.username);
        }
        if (data.password) {
          setPasswordError(data.password);
        }
      }
    }
  };

  return (
    <div className='login'>
      <h2 className='header'>Login</h2>
      <form className='login-form' onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input placeholder='username' onChange={(e) => setUsername(e.target.value)} />
          {usernameError && <p>{usernameError}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type='password'
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p>{passwordError}</p>}
        </div>
        <button className='login-button' disabled={!username || !password ? true : false}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
