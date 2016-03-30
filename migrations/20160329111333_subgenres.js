
exports.up = function(knex, Promise) {
  return knex.schema.table('genres', function(table) {
    table.boolean('subgenre');
    table.integer('root_id').references('genres.id');
    table.integer('genre_id').references('genres.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('genres', function(table) {
    table.dropColumn('subgenre');
    table.dropColumn('root_id');
    table.dropColumn('genre_id');
  });
};
