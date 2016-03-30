
exports.up = function(knex, Promise) {
  return knex.schema.table('genres', function(table) {
    table.text('description')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('genres', function(table) {
    table.dropColumn('description');
  })
};
