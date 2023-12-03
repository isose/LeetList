import Knex from 'knex';
import { Model } from 'objection';
import { development, test } from './knexfile';

let env = development;
if (process.env.NODE_ENV == 'test') {
    env = test;
}

const knex = Knex(env);
Model.knex(knex);

export default knex;
