'use strict'

const
  Faker = require('faker'),
  Artist = require('../../models/Artist'),
  Genre = require('../../models/Genre'),
  User = require('../../models/User');

const makeFakeGenre = () => {
  return {
    name: Faker.company.companyName(),
  }
}

const makeFakeGenreAndSave = () => {
  return Genre.forge(makeFakeGenre()).save()
}

const makeFakeArtist = () => {
  return {
    fullName: Faker.name.findName(),
    description: Faker.lorem.paragraph()
  }
}

const artistAndSave = () => {
  return new Artist(makeFakeArtist()).save()
}

const relationships = (artist) => {
  artist.set('genre', []);
  artist.set('mentors', []);
  artist.set('proteges', []);
  return artist;
}

const _User = () => {
  return {
    username: Faker.internet.userName(),
    firstName: Faker.name.firstName(),
    lastName: Faker.name.lastName(),
    bio: Faker.lorem.paragraph(),
    email: Faker.internet.email(),
    password: Faker.internet.password()
  }
};

const UserAndSave = () => {
  let user = User.forge(_User());
  let password = user.get('password');

  return user.generateHash(password)
  .then(hash => {
    user.set('password', hash)
    return user.save();
  })
  .then(user => {
    return {
      user: user,
      password: password
    };
  })
}

module.exports = {
  Artist: makeFakeArtist,
  Genre: makeFakeGenre,
  artistAndSave: artistAndSave,
  relationships: relationships,
  User: _User,
  UserAndSave: UserAndSave,
  genreAndSave: makeFakeGenreAndSave
};
