'use strict'

const
  Bookshelf = require('../bookshelf');

require('./Artist');
var genres = Bookshelf.Model.extend({
  tableName: 'genres',
  artists: function() {
    return this.belongsToMany(
      'Artist',
      'artists_genre'
    );
  },
  founders: function() {
    return this.belongsToMany(
      'Artist',
      'genre_founders',
      'genre_id',
      'founder_id'
    );
  }
})

module.exports = Bookshelf.model('Genre', genres);
