'use strict'

const Bookshelf = require('../bookshelf'),
      Artist = require('../models/Artist'),
      Genre = require('../models/Genre');

function getGenreByName(name) {
  return Genre.where('name', name).fetch()
}

function resolveRelationships(artist, body) {
  var genres = artist.related('genre');
  var mentors = artist.related('mentors');
  var proteges = artist.related('proteges');

  return Promise.all([
    genres.detach(detachById(genres, body.genre)),
    mentors.detach(detachById(mentors, body.mentors)),
    proteges.detach(detachById(proteges, body.proteges))
  ])
}

function detachById(col, targets) {
  var out = col.map(function(item) {
    for (var i = 0; i < targets.length; i++) {
      if (item.id === targets[i].id) {
        return targets[i].id;
      }
    }
  });

  return out;
}

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

    var genreId, artist
    getGenreByName(req.body.genre)
    .then((genre) => {
      genreId = genre.id;

      delete req.body.genre;

      return Artist.forge(req.body).save()
    })
    .then((_artist) => {
      artist = _artist;
      return artist.genre().attach(genreId)
    })
    .then(() => {
      res.status(200).send(artist);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
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

      return resolveRelationships(artist, req.body)
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
