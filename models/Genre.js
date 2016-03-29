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
  },

  resolveJoins(targets, target) {
    return this.related(target).detach()
    .then(collection => {
      targets = targets.map(target => target.id);
      return collection.attach(targets);
    })
  }
})

module.exports = Bookshelf.model('Genre', genres);
