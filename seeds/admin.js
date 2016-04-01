

exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert(
      {
        id: 1,
        username: 'brett',
        firstName: 'Brett',
        lastName: 'Caudill',
        bio: 'I made this',
        email: 'brett.caudill.is@gmail.com',
        admin: true,
        password: '$2a$08$bKsgoRVkoz8V3Y6xCf082OuYMPeucEDhUn5YVhc3Bo.mv.G1bhj.i'
      }
    )

  );
};
