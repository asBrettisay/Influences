'use strict'

const Bookshelf = require('../bookshelf'),
      Artist = require('../models/Artist'),
      Genre = require('../models/Genre');




module.exports = {
  indexArtists(req, res) {
    Artist.forge()
    .fetchAll()
    .then(artists => res.status(200).json(artists))
    .catch(err => res.status(500).send(err));
  },

  showArtist(req, res) {
    Artist.forge({id: req.params.id})
    .fetch({
      withRelated: ['genre', 'proteges', 'mentors']
    })
    .then(artist => res.status(200).json(artist))
    .catch(err => res.status(500).send(err))
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

    req.body.type = 'artist'

    Artist.forge(req.body).save()
    .then(_artist => {
      artist = _artist;
      return artist.attacher(joins);
    })
    .then(result => res.status(200).json(artist))
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    })


  },

  updateArtist(req, res) {
    let artist;

    let joins = {
      mentors: req.body.mentors,
      proteges: req.body.proteges,
      genres: req.body.genres,
      founder: req.body.founder
    }

    Artist.forge({id: req.params.id})
    .fetch({
      withRelated: [
        'mentors', 'proteges', 'genre'
      ]
    })
    .then(_artist => {
      artist = _artist;
      return Promise.all([
        artist.attacher(joins),
        artist.detacher(joins),
        artist.save({
          fullName: req.body.fullName,
          description: req.body.description,
        })
      ]);
    })
    .then(promises => res.status(200).send({message: 'Update successful'}))
    .catch(err => {
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
    .then(promises => artist.destroy())
    .then(result => res.status(200).send({message: "Deleted artist"}))
    .catch(err => {
      res.status(500).send({message: "Delete failed:", error: err});
    })
  }
};

// Helper functions.
function getGenresByName(targets) {

  let ans;
  return Genre.fetchAll()
  .then(genres => {
    genres = genres.toJSON()
    ans = genres.filter(function(genre) {
      for (var i = 0; i < targets.length; i++) {
        return genre.name === targets[i].name
      }
    })
    .map(genre => genre.id)
    return ans;
  })
}
