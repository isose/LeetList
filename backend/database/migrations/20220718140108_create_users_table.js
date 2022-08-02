/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user', (table) => {
    table.increments('id').primary();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.string('email').unique().notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  const tables = ['user'];
  return Promise.all(
    tables.map(async function (table) {
      try {
        await knex.raw(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      } catch (err) {
        console.error(err);
      }
    }),
  );
};
