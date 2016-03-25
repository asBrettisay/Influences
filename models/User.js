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
          that.set('password', hash);
          if (cb) {
            cb(err, that);
          }
          resolve(that);

        })
      })
    })
  },


  validatePassword: function(password, cb) {

    let err, res;

    bcrypt.compare(password, this.password, function(_err, _res) {
      err = _err, res = _res;
      if (cb) {
        cb(err, res);
      }

    })
    return Promise.resolve(res);

    // return bcrypt.compareSync(password, this.get('password'), function(err, res) {
    //   return res;
    // });
  }
});

module.exports = Bookshelf.model('User', user);
