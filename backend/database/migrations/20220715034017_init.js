/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('question', (table) => {
      table.increments('id').primary();
      table.string('url').unique().notNullable();
      table.string('questionId').unique().notNullable();
      table.string('title').unique().notNullable();
      table.string('difficulty').notNullable();
      table.integer('upVotes');
      table.integer('downVotes');
      table.integer('numberOfAccepted');
      table.integer('numberOfSubmissions');
      table.timestamps(true, true);
    })
    .createTable('questionSlug', (table) => {
      table.increments('id').primary();
      table.string('slug').unique().notNullable();
      table.timestamps(true, true);
    })
    .createTable('tag', (table) => {
      table.increments('id').primary();
      table.string('tagName').unique().notNullable();
      table.timestamps(true, true);
    })
    .createTable('questionTagMap', (table) => {
      table.increments('id').primary();
      table.string('questionId').references('questionId').inTable('question').notNullable();
      table.string('tagName').references('tagName').inTable('tag').notNullable();
      table.unique(['questionId', 'tagName']);
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  const tables = ['question', 'question_slug', 'tag', 'question_tag_map'];
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
