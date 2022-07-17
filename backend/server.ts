import express from 'express';
import routes from './routes/routes';

const port = process.env.PORT || 5000;
const app = express();

app.use(routes);
// This displays message that the server running and listening to specified port
app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
});
