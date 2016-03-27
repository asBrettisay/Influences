'use strict'

const Bookshelf = require('../bookshelf'),
      Artist = require('../models/Artist'),
      Genre = require('../models/Genre');




module.exports = {
  indexArtists(req, res) {
    Artist.forge()
    .fetchAll()
    .then((artists) => {
      res.status(200).json(artists)
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  },

  showArtist(req, res) {
    Artist.forge({id: req.params.id})
    .fetch({
      withRelated: ['genre', 'proteges', 'mentors']
    })
    .then((artist) => {
      res.status(200).json(artist);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  },

  createArtist(req, res) {

    let artist;
    let joins = {
      genre: req.body.genre,
      proteges: req.body.proteges,
      mentors: req.body.mentors
    };
    delete req.body.genre
    delete req.body.proteges
    delete req.body.mentors;
    console.log('Req body before save', req.body);
    Artist.forge(req.body).save()
    .then((_artist) => {
      artist = _artist;
      return artist.attacher(joins);
    })
    .then((result) => {
      res.status(200).json(artist);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    })


  },

  updateArtist(req, res) {
    let artist;
    Artist.forge({id: req.params.id})
    .fetch({
      withRelated: [
        'mentors', 'proteges', 'genre'
      ]
    })
    .then((_artist) => {
      artist = _artist;
      return artist.attacher(req.body)
    })
    .then(() => {

      let gIds = req.body.genre.map(function(g) {
        return g.id;
      })

      let mIds = req.body.mentors.map(function(m) {
        return m.id;
      })

      let pIds = req.body.proteges.map(function(p) {
        return p.id;
      })

      delete req.body.genre;
      delete req.body.mentors;
      delete req.body.proteges;

      let genreP = artist.genre().attach(gIds),
          mentorP = artist.mentors().attach(mIds),
          protegeP = artist.proteges().attach(pIds),
          artistP = artist.save(req.body, {patch: true});

      return Promise.all([genreP, mentorP, artistP, protegeP])
    })
    .then((artist) => {
      res.status(200).send({message: 'Update successful'});
    })
    .catch((err) => {
      console.log('Error updating artist', err);
      res.status(500).send({message: 'Update failed', error: err});
    })
  },

  deleteArtist(req, res) {

    let artist = Artist.forge({id: req.params.id})
    Promise.all([
      artist.founder().detach(),
      artist.genre().detach(),
      artist.proteges().detach(),
      artist.mentors().detach()
    ])
    .then(() => {
      return artist.destroy();
    })
    .then((result) => {
      res.status(200).send({message: "Deleted artist"});
    })
    .catch((err) => {
      res.status(500).send({message: "Delete failed:", error: err});
    })
  }
};

// Helper functions.
function getGenresByName(targets) {

  let ans;
  return Genre.fetchAll()
  .then((genres) => {
    genres = genres.toJSON()
    ans = genres.filter(function(genre) {
      for (var i = 0; i < targets.length; i++) {
        return genre.name === targets[i].name
      }
    })
    .map(function(genre) {
      return genre.id;
    })
    return ans;
  })
}

// function resolveRelationships(artist, body, action) {
//   var genres = artist.related('genre');
//   var mentors = artist.related('mentors');
//   var proteges = artist.related('proteges');
//
//   return Promise.all([
//     genres[action](byId(genres, body.genre)),
//     mentors[action](byId(mentors, body.mentors)),
//     proteges[action](byId(proteges, body.proteges))
//   ])
// }
//
// function byId(col, targets) {
//   if (!col) {
//     console.log('Col is undefined. targets is', targets);
//     return;
//   }
//   var out = col.map(function(item) {
//     for (var i = 0; i < targets.length; i++) {
//       if (item.id === targets[i].id) {
//         return targets[i].id;
//       }
//     }
//   });
//
//   return out;
// }
