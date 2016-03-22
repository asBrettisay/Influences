const Bookshelf = require('../bookshelf');

require('./Genre');
var artist = Bookshelf.Model.extend({
  tableName: 'artists',
  founder: function() {
    return this.belongsToMany(
      'Genre',
      'genre_founders',
      'founder_id'
    );
  },
  genre: function() {
    return this.belongsToMany(
      'Genre',
      'artists_genre',
      'artist_id',
      'genre_id'
    );
  },
  proteges: function() {
    return this.belongsToMany(
      'Artist',
      'artists_proteges',
      'mentor_id',
      'protege_id'
    );
  },
  mentors: function() {
    return this.belongsToMany(
      'Artist',
      'artists_proteges',
      'protege_id',
      'mentor_id'
    );
  }
});

module.exports = Bookshelf.model('Artist', artist);
