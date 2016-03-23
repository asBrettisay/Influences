

exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('genre_founders').del(),
    knex('artists_genre').del(),
    knex('artists_proteges').del(),
    knex('artists').del(),
    knex('genres').del(),


    // Inserts seed entries
    knex('artists').insert([
      {
        fullName: 'Louie Armstrong',
        desc: 'Louis Armstrong (August 4, 1901 – July 6, 1971), nicknamed Satchmo or Pops, was an African American jazz trumpeter, composer and singer who became one of the pivotal and most influential figures in jazz music.',
      },
      {
        fullName: "Joe 'King' Oliver"
      },
      {
        fullName: 'Duke Ellington'
      },
      {
        fullName: 'Bing Crosby'
      },
      {
        fullName: 'Tommy Ladnier'
      },
      {
        fullName: 'Paul Mares'
      },
      {
        fullName: 'Muggsy Spanier'
      },
      {
        fullName: 'Louis Panico'
      },
      {
        fullName: 'Frank Guarente'
      },
      {
        fullName: 'Scott Joplin'
      },
      {
        fullName: "Charles 'Buddy' Bolden"
      },
      {
        fullName: 'Buddy Bolden'
      },
      {
        fullName: 'Sidney Bechet'
      }
    ]),
    knex('genres').insert({name: 'Jazz'})
  );
};
