const Bookshelf = require('../bookshelf');

require('./Genre');

var artist = Bookshelf.Model.extend({
  tableName: 'artists',
  founder: function() {
    return this.belongsTo('Genre');
  },
  genre: function() {
    return this.belongsTo('Genre');
  }
});

module.exports = Bookshelf.model('Artist', artist);
