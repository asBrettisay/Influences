
exports.seed = function(knex, Promise) {
  return Promise.join(
      knex('genres').del(),
      knex('genres').insert({
          name: 'Blues',
          type: 'genre',
          subgenre: false,
        }),
        knex('genres').insert({
          name: 'Classical',
          type: 'genre',
          subgenre: false,
        }),
        knex('genres').insert({
          name: 'Electronic',
          type: 'genre',
          subgenre: false
        }),
        knex('genres').insert({
          name: 'Folk',
          type: 'genre',
          subgenre: false
        }),
        knex('genres').insert({
          name: 'Hip-hop',
          type: 'genre',
          subgenre: false
        }),
        knex('genres').insert({
          name: 'Jazz',
          type: 'genre',
          subgenre: false
        }),
        knex('genres').insert({
          name: 'Reggae',
          type: 'genre',
          subgenre: false
        }),
        knex('genres').insert({
          name: 'Rock',
          type: 'genre',
          subgenre: false
        }),
        knex('genres').insert({
          name: 'Religious',
          type: 'genre',
          subgenre: false
        }),
        knex('genres').insert({
          name: 'Traditional',
          type: 'genre',
          subgenre: false
        }),
        knex('genres').insert({
          name: 'Country',
          type: 'genre',
          subgenre: false
        }
      )
    );
};
