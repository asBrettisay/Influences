var config = require('./knexfile');
var knex = require('knex')(config[process.env.NODE_ENV]);
var Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin('registry')

module.exports = Bookshelf;
