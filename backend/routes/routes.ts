import express from 'express';
const questionRouter = require('./question');

module.exports = function (app: any) {
  app.use(express.json());

  app.use('/', questionRouter);
};
