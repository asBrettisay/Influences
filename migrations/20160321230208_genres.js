
exports.up = function(knex, Promise) {
  return knex.schema.createTable('genres', function(table) {
    table.increments('id').primary();
    table.string('name');
  }).createTable('artists', function(table) {
    table.increments('id').primary();
    table.string('name');
    table.boolean('founder');
    table.integer('founder_genre_id').references('genres.id');
    table.integer('genre_id').references('genres.id');
    table.integer('influence_id').references('artists.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('artists')
    .dropTable('genres');
};
