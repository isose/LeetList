import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import passport from 'passport';

dotenv.config({ path: __dirname + '/./../.env' });

export const COOKIE_OPTIONS: any = {
  httpOnly: true,
  secure: true,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY!) * 1000,
  sameSite: 'none',
};

export const createAccessToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: eval(process.env.ACCESS_TOKEN_EXPIRY!),
  });
};

export const createRefreshToken = (payload: any) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY!),
  });
};

export const verifyUser = passport.authenticate('jwt', { session: false });
