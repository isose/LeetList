const Knex = require('knex');
const knexfile = require('./knexfile');
const { Model } = require('objection');

const knex = Knex(knexfile.development);
Model.knex(knex);

module.exports = knex;
