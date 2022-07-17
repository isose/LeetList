import Knex from 'knex';
import { Model } from 'objection';
import { development } from './knexfile';

const knex = Knex(development);
Model.knex(knex);

export default knex;
