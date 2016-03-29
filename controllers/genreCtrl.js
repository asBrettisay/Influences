'use strict'

const Bookshelf = require('../bookshelf'),
      Artist = require('../models/Artist'),
      Promise = require('bluebird'),
      Genre = require('../models/Genre');


const generateTree = (genre) => {
  return genre.fetch({withRelated: ['founders']})
  .then(genre => {

    let promises = [], artists = genre.related('founders');

    const addArtists = (artists) => {
      artists.each(artist => {
        let result = addGeneration(artist)
        artist.set('proteges', result);
        promises.push(result);
      })
    }

    const addGeneration = (artist) => {
      return artist.related('proteges').fetch()
      .then(artists => {
        addArtists(artists);
        return artists;
      })
    }

    addArtists(artists);

    return Promise.reduce(promises, (results, next) => {
      return Promise.all(promises);
    })
    .then(promises => genre)
  })
}






module.exports = {
  indexGenres(req, res, next) {
    Genre.forge()
    .fetchAll()
    .then(result => res.status(200).json(result))
    .catch(error => {
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
    .then(result => generateTree(result))
    .then(genre => res.status(200).json(genre))
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
    })
  },

  createGenre(req, res) {
    Genre.forge(req.body)
    .save()
    .then(result => res.status(200).json(result))
    .catch(err => {
      console.log('Error creating genre', err);
      res.status(500).send(err);
    })
  },


  updateGenre(req, res) {
    Genre.forge({id: req.params.id})
    .fetch({withRelated: ['founders']})
    .then(genre => {

      let foundersP;
      if (req.body.founders) {
        let founders = req.body.founders.map(f => f.id)

        foundersP = genre.founders().attach(founders);
        delete req.body.founders;
      }

      let artistsP;
      if (req.body.artists) {
        let artists = req.body.artists.map(a => a.id)
        artistsP = genre.artists().attach(artists);
        delete req.body.artists;
      }
      let patchP = genre.save(req.body, {patch:true});

      return foundersP ?
      Promise.all([foundersP, patchP, artistsP]) :
      patchP
    })
    .then(result => res.status(200).send({message: "Update Successful"}))
    .catch(e => {
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
    .then(p => Genre.forge({id: req.params.id}).destroy())
    .then(result => res.status(200).send({message: "Genre deleted"}))
    .catch(err =>
      res.status(500).send({message: "Error deleting user:", err}))
  },

  getRandomGenre(req, res, next) {
    console.log('Going to get random genre');
    Genre.forge().fetchAll()
    .then(genres => genres.query({where: {id: 2}}).fetchOne({columns: 'id'}))
    .then(num => res.status(200).json({id: num.get('id')}))
  }
};
