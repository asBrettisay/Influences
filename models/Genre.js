'use strict'

const
  Bookshelf = require('../bookshelf');

require('./Artist');

var genres = Bookshelf.Model.extend({
  tableName: 'genres',
  artists: function() {
    return this.hasMany('artists');
  },
  founders: function() {
    return this.hasMany('founders');
  }
})

module.exports = Bookshelf.model('Genre', genres);
