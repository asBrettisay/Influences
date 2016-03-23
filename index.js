'use strict'

const express = require('express'),
      bodyParser = require('body-parser'),
      genre = require('./controllers/genreCtrl'),
      artist = require('./controllers/artistCtrl'),
      Genre = require('./models/Genre'),
      Artist = require('./models/Artist'),
      bookshelf = require('./bookshelf'),
      Promise = require('bluebird');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const port = 3000;
app.listen(port, () => {
  console.log('Listening on', port);
})

app.get('/api/genre/random', genre.getRandomGenre);

app.get('/api/genre/', genre.indexGenres);
app.get('/api/genre/:id', genre.showGenre);
app.post('/api/genre/', genre.createGenre);
app.put('/api/genre/:id', genre.updateGenre);
app.delete('/api/genre/:id', genre.deleteGenre);

app.get('/api/artist/', artist.indexArtists);
app.get('/api/artist/:id', artist.showArtist);
app.post('/api/artist/', artist.createArtist);
app.put('/api/artist/:id', artist.updateArtist);
app.delete('/api/artist/:id', artist.deleteArtist);

app.post('/api/seed/joins', function(req, res) {

  var founders = [];

  var jazz = Genre.forge({name: 'Jazz'}).fetch();


  var artists = bookshelf.Collection.extend({
    model: Artist
  })

  var artistsP = artists.forge()
  .fetch()
  .then((artists) => {

    artists.filter(function(i) {
      let target = ['Joe \'King\' Oliver',
                      'Scott Joplin',
                      'Charles \'Buddy\' Bolden',
                      'Buddy Bolden'
                    ];
      if (target.includes(i.get('fullName'))) { return i };
    })
    .forEach(function(i) {
      founders.push(i.id);
    });
    console.log('Founders ids', founders);
  })


  Promise.all([jazz, artists])
  .spread((jazz, artists) => {

    var p1 = jazz.founders().attach(founders);
    var p2 = jazz.artists().attach(founders);

    Promise.join(p1, p2, function(founders, artists) {
      res.status(200).send('Success!');
    })
  })



})

module.exports = app;
