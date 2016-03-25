const
  Bookshelf = require('../bookshelf'),
  bcrypt = require('bcrypt-nodejs');

require('./Artist');
var user = Bookshelf.Model.extend({
  tableName: 'users',
  artists: function() {
    this.belongsToMany('Artist')
  },
  generateHash: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  validatePassword: function(password) {
    return bcrypt.compareSync(password, this.get('password'));
  }
});

module.exports = Bookshelf.model('User', user);
