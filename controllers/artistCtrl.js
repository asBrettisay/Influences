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
    Artist.forge(req.body).save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  },

  updateArtist(req, res) {
    Artist.forge({id: req.params.id}).fetch()
    .then((artist) => {
      return artist.save(req.body, {patch: true})
    })
    .then((artist) => {
      res.status(200).send({message: 'Update successful'});
    })
    .catch((err) => {
      res.status(500).send({message: 'Update failed'});
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
      res.status(500).send({message: "Delete failed:", err});
    })
  }
};
