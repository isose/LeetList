import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosPrivate } from 'src/api/axios';
import useAuth from 'src/hooks/useAuth';
import styles from 'styles/pages/Login/Component/LoginForm.module.css';
import isEmail from 'validator/es/lib/isEmail';

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,30}$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,60}$/;

const LoginForm = ({ toggleLoginForm }: { toggleLoginForm: () => void }) => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  useEffect(() => {
    setUsernameError('');
  }, [username]);

  useEffect(() => {
    setPasswordError('');
  }, [password]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        '/api/login',
        JSON.stringify({ username, password }),
      );
      const accessToken = response.data.accessToken;
      setAuth?.({ accessToken, username });
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err?.response) {
        const data = err.response.data;
        setUsernameError(data.username);
        setPasswordError(data.password);
      }
    }
  };

  return (
    <div className={styles.container} data-testid='login-form'>
      <h2 className={styles.header}>Login</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles['input-wrapper']}>
          <label>Username</label>
          <input placeholder='username' onChange={(e) => setUsername(e.target.value)} />
          {usernameError && <p>{usernameError}</p>}
        </div>
        <div className={styles['input-wrapper']}>
          <label>Password</label>
          <input
            type='password'
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p>{passwordError}</p>}
        </div>
        <button className={styles.button} disabled={!username || !password ? true : false}>
          Login
        </button>
        <div className={styles.footer}>
          <div>Don&apos;t have an account?</div>
          <span onClick={toggleLoginForm}>Register</span>
        </div>
      </form>
    </div>
  );
};

const RegisterForm = ({ toggleLoginForm }: { toggleLoginForm: () => void }) => {
  const [email, setEmail] = useState<string>('');
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [username, setUsername] = useState<string>('');
  const [validUsername, setValidUsername] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [validMatch, setValidMatch] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');

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
      await axiosPrivate.post('/api/register', JSON.stringify({ email, username, password }));
      toggleLoginForm();
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
    <div className={styles.container}>
      <h2 className={styles.header}>Registration</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles['input-wrapper']}>
          <label>Email</label>
          <input
            className={email && (!validEmail || emailError) ? styles.invalid : ''}
            placeholder='email'
            onChange={(e) => setEmail(e.target.value)}
          />
          {email && !validEmail && <p>Enter a valid email.</p>}
          {emailError && <p>{emailError}</p>}
        </div>
        <div className={styles['input-wrapper']}>
          <label>Username</label>
          <input
            className={username && (!validUsername || usernameError) ? styles.invalid : ''}
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
        <div className={styles['input-wrapper']}>
          <label>Password</label>
          <input
            className={password && !validPassword ? styles.invalid : ''}
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
              Must contain an upper case letter.
              <br />
              Must contain a special character.
            </p>
          )}
        </div>
        <div className={styles['input-wrapper']}>
          <label>Confirm password</label>
          <input
            className={confirmPassword && !validMatch ? styles.invalid : ''}
            type='password'
            placeholder='confirm password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && !validMatch && <p>Passwords must match.</p>}
        </div>
        <button
          className={styles.button}
          disabled={!validEmail || !validUsername || !validPassword || !validMatch ? true : false}
        >
          Register
        </button>
        <div className={styles.footer}>
          <div>Have an account?</div>
          <span onClick={toggleLoginForm}>Login</span>
        </div>
      </form>
    </div>
  );
};

const Login = () => {
  const [loginForm, setLoginForm] = useState<boolean>(true);

  const toggleLoginForm = () => {
    setLoginForm(!loginForm);
  };

  return loginForm ? (
    <LoginForm toggleLoginForm={toggleLoginForm} />
  ) : (
    <RegisterForm toggleLoginForm={toggleLoginForm} />
  );
};

export default Login;
