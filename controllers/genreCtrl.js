'use strict'

const Bookshelf = require('../bookshelf'),
      Artist = require('../models/Artist'),
      Genre = require('../models/Genre');

module.exports = {
  indexGenres(req, res, next) {
    Genre.forge()
    .fetchAll()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    })
  },

  showGenre(req, res) {
    Genre.forge({id: req.params.id})
    .fetch({
      withRelated: [
        'founders', 'artists'
      ]
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    })
  },

  createGenre(req, res) {
    Genre.forge(req.body)
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log('Error creating genre', err);
      res.status(500).send(err);
    })
  },

  updateGenre(req, res) {
    Genre.forge({id: req.params.id})
    .fetch()
    .then((genre) => {
      return genre.save(req.body, {patch: true})
    })
    .then((result) => {
      res.status(200).send({message: "Update Successful"})
    })
    .catch((e) => {
      console.log('Error updating genre', e);
      res.status(500).send({message: "Error Updating:", e})
    })
  },

  deleteGenre(req, res) {
    let genre = Genre.forge({id: req.params.id});
    Promise.all([
      genre.founders().detach(),
      genre.artists().detach()
    ])
    .then(() => {
      return Genre.forge({id: req.params.id}).destroy()
    })
    .then((result) => {
      res.status(200).send({message: "Genre deleted"})
    })
    .catch((err) => {
      res.status(500).send({message: "Error deleting user:", err})
    })
  }
};
