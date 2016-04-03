
exports.up = function(knex, Promise) {
  return knex.schema.createTable('genres', function(table) {
    table.increments('id').primary();
    table.string('name').unique();
    table.string('type');
    table.boolean('subgenre');
    table.integer('root_id').references('genres.id');
    table.integer('genre_id').references('genres.id');
    table.text('description');
  }).createTable('artists', function(table) {
    table.increments('id').primary();
    table.string('fullName');
    table.string('firstName');
    table.string('lastName');
    table.text('description');
    table.boolean('founder');
    table.string('type');
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
  .createTable('users', function(table) {
    table.increments('id').primary();
    table.string('username').unique();
    table.string('firstName');
    table.string('lastName');
    table.text('bio');
    table.string('email');
    table.string('password');
  })
  .createTable('users_artists', function(table) {
    table.integer('user_id').references('users.id');
    table.integer('artist_id').references('artists.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('genre_founders')
    .dropTable('artists_genre')
    .dropTable('artists_proteges')
    .dropTable('users_artists')
    .dropTable('users')
    .dropTable('artists')
    .dropTable('genres');
};
