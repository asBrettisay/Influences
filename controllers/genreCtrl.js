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

    let addGeneration = (artist) => {
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

const generateMainTree = rootGenre => {
  let subgenres = rootGenre.related('subgenres');
  let promises = [];

  const addGenres = genres => {
    genres.each(genre => {
      let result = addGeneration(genre)
      genre.set('subgenres', result);
      promises.push(result)
    })
  }

  let addGeneration = genre => {
    return genre.related('subgenres').fetch()
    .then(genres => {
      addGenres(genres);
      return genres;
    })
  }

  addGenres(subgenres);

  return Promise.reduce(promises, (results, next) => {
    return Promise.all(promises);
  })
  .then(promises => rootGenre)
}


function addSubgenres(genre, subgenres) {

  if (!subgenres) {
    return;
  }

  let promises = [];
  subgenres.forEach(function(subgenre) {
    let promise = Genre.forge({id: subgenre.id}).fetch()
    .then(subgenre => {
      return subgenre.set('root_id', genre.id).save()
    });
    promises.push(promise);
  })

  return Promise.all(promises);
}



module.exports = {
  indexMainGenres(req, res, next) {
    console.log('In indexMainGenres');
    Genre.forge().where({subgenre: false})
    .fetchAll({withRelated: ['subgenres']})
    .then(result => {
      let promises = [];
      result.each(function(genre) {
        promises.push(generateMainTree(genre))
      })

      return Promise.all(promises)
    })
    .then(result => res.status(200).json(result))
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
    })
  },

  indexGenres(req, res, next) {
    console.log('in indexGenres');
    Genre.forge().fetchAll()
    .then(result => res.status(200).json(result))
    .catch(err => {res.status(500).send(err)});
  },

  showGenre(req, res) {
    Genre.forge({id: req.params.id})
    .fetch({
      withRelated: [
        'founders', 'artists', 'subgenres'
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
    let root;

    if (req.body.root) {
      root = req.body.root;
      delete req.body.root;
    }

    req.body.subgenre = true;
    req.body.type = 'genre';

    let genre = Genre.forge(req.body);

    if (root) {
      genre.set('root_id', root.id);
    }

    genre.save()
    .then(result => res.status(200).json(result))
    .catch(err => {
      console.log('Error creating genre', err);
      res.status(500).send(err);
    })
  },


  updateGenre(req, res) {
    Genre.forge({id: req.params.id})
    .fetch({withRelated: ['founders', 'artists', 'subgenres']})
    .then(genre => {
      let promises = [];

      if (req.body.root) {
        promises.push(genre.set('root_id', req.body.root.id).save())
        delete req.body.root;
      }

      promises.push(addSubgenres(genre.toJSON(), req.body.subgenres));
      promises.push(genre.resolveJoins(req.body.founders || [], 'founders'));
      promises.push(genre.resolveJoins(req.body.artists || [], 'artists'));
      promises.push(genre.save(req.body, {patch: true}));

      delete req.body.founders;
      delete req.body.artists;
      delete req.body.subgenres;

      return Promise.all(promises)
    })
    .then(result => res.status(200).send({message: "Update Successful", result: result}))
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

    Genre.forge().fetchAll()
    .then(genres => genres.query({where: {id: 2}}).fetchOne({columns: 'id'}))
    .then(num => res.status(200).json({id: num.get('id')}))
  }
};
