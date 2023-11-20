import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
import * as authenticate from '../authenticate';
import '../database/knex';
import User from '../database/models/user';

dotenv.config({ path: __dirname + '/./../.env' });

const validateRegisterInput = async (req: any) => {
  const result: any = { isValid: true, errors: {} };

  const usernameExists = await User.query().findOne('username', req.body.username);
  if (usernameExists) {
    result.errors.username = 'Username already taken.';
    result.isValid = false;
  }

  const emailExists = await User.query().findOne('email', req.body.email);
  if (emailExists) {
    result.errors.email = 'Email already exists.';
    result.isValid = false;
  }

  return result;
};

export const register = async (req: any, res: any) => {
  const { isValid, errors } = await validateRegisterInput(req);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, async (err, hash) => {
      if (err) {
        console.log(err);
      }

      const newUser = {
        username: req.body.username,
        password: hash,
        email: req.body.email,
      };
      await User.query().insert(newUser);
    });
  });

  return res.status(200).json({ success: true });
};

export const login = async (req: any, res: any) => {
  const user: any = await User.query().findOne('username', req.body.username);
  if (!user) {
    return res.status(400).json({ username: 'Username not found.' });
  }

  bcrypt.compare(req.body.password, user.password).then((isMatch) => {
    if (!isMatch) {
      return res.status(400).json({ password: 'Password incorrect.' });
    }

    const payload = { userId: user.id, username: user.username };
    res.cookie(
      'refreshToken',
      authenticate.createRefreshToken(payload),
      authenticate.COOKIE_OPTIONS,
    );
    return res.status(200).json({
      success: true,
      username: user.username,
      accessToken: authenticate.createAccessToken(payload),
    });
  });
};

export const logout = (req: any, res: any) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
  return res.status(204).json({ success: true });
};

export const refreshToken = async (req: any, res: any) => {
  let payload: any = null;
  try {
    payload = verify(req.signedCookies.refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return res.status(403).json({ success: false, accessToken: '' });
  }

  const user: any = await User.query().findById(payload.userId);
  if (!user) {
    return res.status(403).json({ success: false, accessToken: '' });
  }

  payload = { userId: user.id, username: user.username };
  res.cookie('refreshToken', authenticate.createRefreshToken(payload), authenticate.COOKIE_OPTIONS);
  return res.status(200).json({
    success: true,
    username: user.username,
    accessToken: authenticate.createAccessToken(payload),
  });
};
