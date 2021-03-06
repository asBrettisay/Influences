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
      pg = require('pg'),
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


const port = 80;
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
  user.isInvited,
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

app.get('/api/search/', function(req, res) {
  let query = req.query.query;


  Promise.all([
    Artist.forge().where('fullName', '~*', query).fetchAll(),
    Genre.forge().where('name', '~*', query).fetchAll(),
  ])
  .spread((artistResults, genreResults) => {

    let ans = [];
    if (artistResults) artistResults.each((artist) => ans.push(artist));
    if (genreResults) genreResults.each((genre) => ans.push(genre));

    res.status(200).json(ans);

  })
})

//Genres.
app.get('/api/genre/', genre.indexGenres);
app.get('/api/genre/:id', genre.showGenre);
app.get('/api/main/genres/', genre.indexMainGenres);

app.post('/api/genre/', genre.createGenre);
app.put('/api/genre/:id', user.isAuth, genre.updateGenre);
app.delete('/api/genre/:id', user.isAuth, genre.deleteGenre);

//Artists.
app.get('/api/artist/', artist.indexArtists);
app.get('/api/artist/:id', artist.showArtist);
app.post('/api/artist/', user.isAuth, artist.createArtist);
app.put('/api/artist/:id', user.isAuth, artist.updateArtist);
app.delete('/api/artist/:id', user.isAuth, artist.deleteArtist);

//Users.
app.get('/api/users/', user.isAuth, user.indexUsers);
app.get('/api/users/:id', user.isAuth, user.showUser);
app.get('/api/current/user', user.getCurrentUser);

app.post('/api/users/', user.isAuth, user.createUser);
app.post('/api/users/token', user.isAuth, user.isAdmin, user.createInviteToken);

app.put('/api/users/:id', user.isAuth, user.updateUser);
app.delete('/api/users/:id', user.isAuth, user.deleteUser);

app.post('/api/seed/joins', user.isAuth, user.isAdmin, function(req, res) {

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
