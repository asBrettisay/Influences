const
  Faker = require('faker'),
  Artist = require('../../models/Artist');

function makeFakeGenre() {
  return {
    name: Faker.company.companyName()
  }
}

function makeFakeArtist() {
  return {
    fullName: Faker.name.findName(),
  }
}

function artistAndSave() {
  return new Artist(makeFakeArtist()).save()
}

function relationships(artist) {
  artist.set('genre', []);
  artist.set('mentors', []);
  artist.set('proteges', []);
  return artist;
}

module.exports = {
  Artist: makeFakeArtist,
  Genre: makeFakeGenre,
  artistAndSave: artistAndSave,
  relationships: relationships
};
