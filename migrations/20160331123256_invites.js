
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.boolean('admin');
    t.string('inviteToken');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('admin');
    t.dropColumn('inviteToken');
  })
};
