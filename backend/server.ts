import express from 'express';
import { sequelize } from './models';

const app = express();
const port = process.env.PORT || 5000;

require('./routes/routes')(app);

// create database tables
async () => {
  await sequelize.sync();
};

// This displays message that the server running and listening to specified port
app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
  await sequelize.authenticate();
  console.log('Database connected!');
});
