'use strict'

const Bookshelf = require('../bookshelf'),
      Artist = require('../models/Artist'),
      Genre = require('../models/Genre');

function getGenreByName(name) {
  return Genre.where('name', name).fetch()
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
    Artist.forge({id: req.params.id}).fetch()
    .then((artist) => {

      let gIds = req.body.genre.map(function(g) {
        return g.id;
      })

      let mIds = req.body.mentors.map(function(m) {
        return m.id;
      })

      delete req.body.genre;
      delete req.body.mentors;
      delete req.body.proteges;

      let genreP = artist.genre().attach(gIds),
          mentorP = artist.mentors().attach(mIds),
          artistP = artist.save(req.body, {patch: true});

      return Promise.all([genreP, mentorP, artistP])
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
