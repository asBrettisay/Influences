'use strict'

const express = require('express'),
      bodyParser = require('body-parser'),
      genre = require('./controllers/genreCtrl'),
      artist = require('./controllers/artistCtrl'),
      user = require('./controllers/userCtrl'),
      User = require('./models/User'),
      Genre = require('./models/Genre'),
      Artist = require('./models/Artist'),
      bookshelf = require('./bookshelf'),
      session = require('express-session'),
      config = require('./_config.js'),
      passport = require('./passport'),
      Promise = require('bluebird'),
      Strategy = require('passport-local').Strategy;


// Initialize Express.
var app = express();

// Express middleware.
app.use(bodyParser.json());
app.use(express.static('public'));

// Express session config.
app.use(session({
  secret: config.secret,
  saveUninitialized: false,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());


const port = 3000;
app.listen(port, () => {
  console.log('Listening on', port);
})

app.get('/api/genre/random', genre.getRandomGenre);

//Authentication
app.post('/login',
        passport.authenticate('login',
        {failureRedirect: '/'}),
        function(req, res) {
        res.status(200).send(
          {
            message: 'ok',
            user: req.user
          });
  });

app.post('/signup',
  passport.authenticate('signup', {
    failureRedirect: '/',
  }),
  function(req, res) {
    res.status(200).send(
      {
        message: 'ok',
        user: req.user
      }
    )}
);

app.post('/logout', function(req, res) {
  req.logout();
  req.session.destroy();
  res.status(200).send('Logged out!');
})

//Genres.
app.get('/api/genre/', genre.indexGenres);
app.get('/api/genre/:id', genre.showGenre);

app.post('/api/genre/', genre.createGenre);
app.put('/api/genre/:id', genre.updateGenre);
app.delete('/api/genre/:id', genre.deleteGenre);

//Artists.
app.get('/api/artist/', artist.indexArtists);
app.get('/api/artist/:id', artist.showArtist);
app.post('/api/artist/', artist.createArtist);
app.put('/api/artist/:id', artist.updateArtist);
app.delete('/api/artist/:id', artist.deleteArtist);

//Users.
app.get('/api/users/', user.indexUsers);
app.get('/api/users/:id', user.showUser);
app.post('/api/users/', user.createUser);
app.put('/api/users/:id', user.updateUser);
app.delete('/api/users/:id', user.deleteUser);

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
