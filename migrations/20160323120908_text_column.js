
exports.up = function(knex, Promise) {
  return knex.schema.table('artists', function(table) {
    table.dropColumn('desc');
    table.text('description');
  })

};

exports.down = function(knex, Promise) {
  return knex.schema.table('artists', function(table) {
    table.dropColumn('description');
    table.string('desc');

  })
};
