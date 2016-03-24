const Bookshelf = require('../bookshelf');

require('./Artist');
var user = Bookshelf.Model.extend({
  tableName: 'users',
  artists: function() {
    this.belongsToMany('Artist')
  }
});

module.exports = Bookshelf.model('User', user);
