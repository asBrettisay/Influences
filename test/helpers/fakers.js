'use strict'

const
  Faker = require('faker'),
  Artist = require('../../models/Artist'),
  User = require('../../models/User');

const makeFakeGenre = () => {
  return {
    name: Faker.company.companyName()
  }
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


  return user.save();
}

module.exports = {
  Artist: makeFakeArtist,
  Genre: makeFakeGenre,
  artistAndSave: artistAndSave,
  relationships: relationships,
  User: _User,
  UserAndSave: UserAndSave
};
