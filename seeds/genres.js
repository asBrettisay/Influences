
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('genre_founders').del(),
    knex('artists_genre').del(),
    knex('genres').del()
  );
};
