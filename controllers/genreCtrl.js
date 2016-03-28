'use strict'

const Bookshelf = require('../bookshelf'),
      Artist = require('../models/Artist'),
      Promise = require('bluebird'),
      Genre = require('../models/Genre');


      // function generateTree(genre) {
      //   return genre.fetch({withRelated: ['founders']})
      //   .then((genre) => {
      //
      //     let promises = [];
      //     // Get each founders proteges.
      //     genre.related('founders').each(function(artist) {
      //       promises.push(artist.fetch({withRelated: ['proteges']}));
      //     })
      //
      //     return Promise.all(promises).then(function(artists) {
      //       let allPromises = [], allArtists = [];
      //
      //
      //       let i = 10;
      //       function addArtists(artists) {
      //         let promises = [];
      //         let method = artists.forEach ? 'forEach' : 'each';
      //         artists[method]((artist) => {
      //           let results = addGeneration(artist);
      //           promises.push(results.then(function(_artists) {
      //             i--;
      //             if (i > 0) addArtists(_artists);
      //             else return;
      //           }))
      //         })
      //         allPromises.push(promises.map(function(p) { return p }));
      //       }
      //       addArtists(artists);
      //
      //
      //
      //       return Promise.all(allPromises).then(function(artists) {
      //         console.log('All artist', allArtists);
      //         return genre;
      //       });
      //     });
      //   })
      // }

function generateTree(genre) {
  return genre.fetch({withRelated: ['founders']})
  .then((genre) => {

    let promises = [], artists = genre.related('founders');

    function addArtists(artists) {

      artists.each((artist) => {
        let result = addGeneration(artist)
        artist.set('proteges', result);
        promises.push(result);
      })

    }

    function addGeneration(artist) {
      return artist.related('proteges').fetch().then((artists) => {

        addArtists(artists);
        return artists;
      })
    }

    addArtists(artists);

    return Promise.reduce(promises, function(results, next) {
      return Promise.all(promises);
    }).then(() => {
      return genre;
    })
  })
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
      return generateTree(result);
    })
    .then((genre) => {

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

  getRandomGenre(req, res, next) {
    console.log('Going to get random genre');
    Genre.forge().fetchAll()
    .then((genres) => {

      return genres.query({where: {id: 2}}).fetchOne({columns: 'id'})
    })
    .then((num) => {

      res.status(200).json({id: num.get('id')})
    })
  }
};
