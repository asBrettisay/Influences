
exports.up = function(knex, Promise) {
  return knex.schema.createTable('genres', function(table) {
    table.increments('id').primary();
    table.string('name').unique();
  }).createTable('artists', function(table) {
    table.increments('id').primary();
    table.string('fullName');
    table.string('desc');
    table.boolean('founder');
  })
  .createTable('genre_founders', function(table) {
    table.integer('genre_id').references('genres.id');
    table.integer('founder_id').references('artists.id');
  })
  .createTable('artists_genre', function(table) {
    table.integer('artist_id').references('artists.id');
    table.integer('genre_id').references('genres.id');
  })
  .createTable('artists_proteges', function(table) {
    table.integer('mentor_id').references('artists.id');
    table.integer('protege_id').references('artists.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('genre_founders')
    .dropTable('artists_genre')
    .dropTable('artists_proteges')
    .dropTable('artists')
    .dropTable('genres');
};
