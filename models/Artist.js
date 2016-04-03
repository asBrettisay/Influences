const Bookshelf = require('../bookshelf');

require('./Genre');
var artist = Bookshelf.Model.extend({
  tableName: 'artists',
  founder: function() {
    return this.belongsToMany(
      'Genre',
      'genre_founders',
      'founder_id'
    );
  },
  genre: function() {
    return this.belongsToMany(
      'Genre',
      'artists_genre',
      'artist_id',
      'genre_id'
    );
  },
  proteges: function() {
    return this.belongsToMany(
      'Artist',
      'artists_proteges',
      'mentor_id',
      'protege_id'
    );
  },
  mentors: function() {
    return this.belongsToMany(
      'Artist',
      'artists_proteges',
      'protege_id',
      'mentor_id'
    );
  },


  attacher: function(body) {
    return Promise.all([
      this.founder().attach(idMap(body.genre || [])),
      this.proteges().attach(idMap(body.proteges || [])),
      this.mentors().attach(idMap(body.mentors || []))
    ])
    .catch((err) => {
      throw err;
    })
  },

  detacher: function(body) {
    return resolveRelationships.call(this, body, 'detach')
  }

});


function resolveRelationships(body, action) {
  var genres = this.related('genre');
  var mentors = this.related('mentors');
  var proteges = this.related('proteges');

  return Promise.all([
    genres[action](byId(genres, body.genre || [])),
    mentors[action](byId(mentors, body.mentors || [])),
    proteges[action](byId(proteges, body.proteges || []))
  ])
}

function idMap(col) {
  return col.map(function(i) {
    return i.id;
  })
}

function byId(col, targets) {
  if (!col) {
    return;
  }
  var out = col.map(function(item) {
    for (var i = 0; i < targets.length; i++) {
      if (item.id === targets[i].id) {
        return targets[i].id;
      }
    }
  });
  return out;
}

module.exports = Bookshelf.model('Artist', artist);
