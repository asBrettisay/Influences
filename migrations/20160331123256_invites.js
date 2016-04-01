
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.string('inviteToken');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('inviteToken');
  })
};
