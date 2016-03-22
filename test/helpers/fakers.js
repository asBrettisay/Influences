const
  Faker = require('faker');

function makeFakeGenre() {
  return {
    name: Faker.company.companyName()
  }
}

function makeFakeArtist() {
  return {
    name: Faker.name.findName()
  }
}

module.exports = {
  Artist: makeFakeArtist,
  Genre: makeFakeGenre
};
