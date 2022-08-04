/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('questionList', (table) => {
      table.increments('id').primary();
      table.string('username').references('username').inTable('user').notNullable();
      table.string('name').notNullable();
      table.boolean('public').notNullable();
      table.timestamps(true, true);
    })
    .createTable('questionListItem', (table) => {
      table.increments('id').primary();
      table.integer('questionListId').references('id').inTable('questionList').notNullable();
      table.string('questionId').references('questionId').inTable('question').notNullable();
      table.unique(['questionListId', 'questionId']);
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  const tables = ['question_list', 'question_list_item'];
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
