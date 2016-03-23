
exports.up = function(knex, Promise) {
  return knex.schema.table('artists', function(table) {
    table.string('firstName');
    table.string('lastName');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('artists', function(table) {
    table.dropColumn('firstName');
    table.dropColumn('lastName');
  })
};
