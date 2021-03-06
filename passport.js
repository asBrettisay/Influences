const
 passport = require('passport'),
 Strategy = require('passport-local').Strategy,
 User = require('./models/User'),
 config = require('./_config.js');

// Passport login strategy.
passport.use('login', new Strategy(
  function(username, password, done) {
    User.forge({username: username}).fetch()
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      return user.validatePassword(password, function(err, res) {
        if(res) {
          return done(null, user.toJSON())
        } else {
          return done(null, false);
        }
      })

    })
    .catch((err) => {
      return done(err);
    })
  }
));

passport.use('signup', new Strategy(
  function(username, password, done) {
    User.forge({username: username}).fetch()
    .then((user) => {
      if (user) return done(null, false);
      else {
        var newUser = User.forge({username: username})

        newUser.generateHash(password)
        .then((hash) => {
          return newUser.save({password: hash})
        })
        .then(() => {
          return done(null, newUser.toJSON());
        })
      }
    })
  }
))


// Passport session persistence.
passport.serializeUser(function(user, done) {
  done(null, user.id);
})

passport.deserializeUser(function(id, done) {
  User.forge({id: id}).fetch()
  .then((user) => {
    done(null, user.toJSON());
  })
  .catch((err) => {
    console.log(err);
  });
});

module.exports = passport;
