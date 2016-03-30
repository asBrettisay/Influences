'use strict'

const
  Bookshelf = require('../bookshelf');

var genres = Bookshelf.Model.extend({
  tableName: 'genres',
  artists() {
    return this.belongsToMany(
      'Artist',
      'artists_genre'
    );
  },
  subgenres() {
    return this.hasMany('Genre', 'root_id')
  },
  subGenreList() {
    return this.belongsTo('Genre', 'genre_id')
  },
  root() {
    return this.belongsTo('Genre', 'root_id')
  },
  genre() {
    return this.belongsTo('Genre', 'genre_id')
  },
  founders() {
    return this.belongsToMany(
      'Artist',
      'genre_founders',
      'genre_id',
      'founder_id'
    );
  },

  // addGenre(genre) {
  //
  //   if (!genre) {
  //     return;
  //   }
  //
  //   let promises = [];
  //   genre.forEach(function(subgenre) {
  //     let promise = Genre.forge({id: subgenre.id}).fetch()
  //     .then(subgenre => {
  //       return subgenre.set('genre_id', genre.id).save()
  //     });
  //     promises.push(promise);
  //   })
  //
  //   return Promise.all(promises);
  // },

  resolveJoins(targets, target) {
    return this.related(target).detach()
    .then(collection => {
      targets = targets.map(target => target.id);
      return collection.attach(targets);
    })
  }
})

module.exports = Bookshelf.model('Genre', genres);
