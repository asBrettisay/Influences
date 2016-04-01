'use strict'

const
  Bookshelf = require('../bookshelf'),
  Promise = require('bluebird'),
  bcrypt = require('bcrypt');

require('./Artist');
var user = Bookshelf.Model.extend({
  tableName: 'users',
  artists: function() {
    this.belongsToMany('Artist')
  },


  generateHash: function(password, cb) {
    var that = this;
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(8, function(err, salt) {
        bcrypt.hash(password, salt, function(_err, hash) {
          if (_err) {
            err = _err;
            reject(err);
          }
          if (cb) {
            cb(err, hash);
          }
          resolve(hash);
        })
      })
    })
  },


  validatePassword: function(password, cb) {

    let err, res;
    console.log('Going to bcrypt');
    bcrypt.compare(password, this.get('password'), function(_err, _res) {
      err = _err, res = _res;
      console.log('Err in bcrypt', err);
      console.log('in bcrypt');
      console.log('res in bcrypt', res);
      if (cb) {
        cb(err, res);
      }
    })
    return Promise.resolve(res);


  }
});

module.exports = Bookshelf.model('User', user);
