import * as dotenv from 'dotenv';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import { knexSetup } from '../database/knex';
import User from '../database/models/user';

knexSetup();
dotenv.config({ path: __dirname + '/./../../.env' });

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    User.query()
      .findById(payload.userId)
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        return done(err, false);
      });
  }),
);
