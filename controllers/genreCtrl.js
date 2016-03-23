'use strict'

const Bookshelf = require('../bookshelf'),
      Artist = require('../models/Artist'),
      Genre = require('../models/Genre');

function gatherArtists(model) {
  var founders = model.related('founders')
                  .fetch({
                    withRelated: [
                      'proteges'
                    ]
                  })

  return Promise.resolve(founders);
}

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
      return Promise.all([
        gatherArtists(result),
        result
      ])
    })
    .spread((artists, genre) => {
      genre.founders = artists;

      res.status(200).json(genre);
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

      let foundersP;
      if (req.body.founders) {
        let founders = req.body.founders.map(function(f) {
          return f.id;
        })

        foundersP = genre.founders().attach(founders);
        delete req.body.founders;
      }

      let patchP = genre.save(req.body, {patch:true});

      return foundersP ?
      Promise.all([foundersP, patchP]) :
      patchP
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
  },

  getRandomGenre(req, res) {
    Genre.forge().fetchAll()
    .then((genres) => {
      var num = (genres.length === 1) ? 1 : Math.floor(Math.random() * genres.length);
      return Genre.forge({id: num})
      .fetch({
        withRelated: [
          'founders'
        ]
      })
    .then((genre) => {
      res.status(200).json(genre);
      })
    })
  }
};
