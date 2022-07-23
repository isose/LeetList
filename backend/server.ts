import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import './config/passport';
import routes from './routes/routes';

dotenv.config({ path: __dirname + '/./../.env' });

const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());

app.use(routes);
// This displays message that the server running and listening to specified port
app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
});
