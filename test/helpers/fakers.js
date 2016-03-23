const
  Faker = require('faker');

function makeFakeGenre() {
  return {
    name: Faker.company.companyName()
  }
}

function makeFakeArtist() {
  return {
    fullName: Faker.name.findName()
  }
}

module.exports = {
  Artist: makeFakeArtist,
  Genre: makeFakeGenre
};
