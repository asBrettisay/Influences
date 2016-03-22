'use strict'

const express = require('express'),
      bodyParser = require('body-parser'),
      genre = require('./controllers/genreCtrl'),
      artist = require('./controllers/artistCtrl');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const port = 3000;
app.listen(port, () => {
  console.log('Listening on', port);
})

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

module.exports = app;
