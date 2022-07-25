import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import isEmail from 'validator/es/lib/isEmail';

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,30}$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,60}$/;

const Register = () => {
  const nagivate = useNavigate();

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    setValidEmail(isEmail(email));
    setEmailError('');
  }, [email]);

  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username));
    setUsernameError('');
  }, [username]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validEmail || !validUsername || !validPassword || !validMatch) {
      return;
    }

    try {
      await axios.post('/api/register', JSON.stringify({ email, username, password }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      nagivate('/login');
    } catch (err: any) {
      if (err?.response) {
        const data = err.response.data;
        if (data.email) {
          setEmailError(data.email);
        }
        if (data.username) {
          setUsernameError(data.username);
        }
      }
    }
  };

  return (
    <div className='register'>
      <h2 className='header'>Registration</h2>
      <form className='register-form' onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            className={email && !validEmail ? 'invalid' : ''}
            placeholder='email'
            onChange={(e) => setEmail(e.target.value)}
          />
          {email && !validEmail && <p>Enter a valid email.</p>}
          {emailError && <p>{emailError}</p>}
        </div>
        <div>
          <label>Username</label>
          <input
            className={username && !validUsername ? 'invalid' : ''}
            placeholder='username'
            onChange={(e) => setUsername(e.target.value)}
          />
          {username && !validUsername && (
            <p>
              Must contain 3 to 30 characters.
              <br />
              Must begin with a letter.
              <br />
              Only letters, numbers, and underscores allowed.
            </p>
          )}
          {usernameError && <p>{usernameError}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            className={password && !validPassword ? 'invalid' : ''}
            type='password'
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && !validPassword && (
            <p>
              Must contain 8 to 60 characters.
              <br />
              Must contain a number.
              <br />
              Must contain a upper case letter.
              <br />
              Must contain a special character.
            </p>
          )}
        </div>
        <div>
          <label>Confirm password</label>
          <input
            className={confirmPassword && !validMatch ? 'invalid' : ''}
            type='password'
            placeholder='confirm password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && !validMatch && <p>Password must match.</p>}
        </div>
        <button
          className='register-button'
          disabled={!validEmail || !validUsername || !validPassword || !validMatch ? true : false}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
