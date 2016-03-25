const
 passport = require('passport'),
 Strategy = require('passport-local').Strategy,
 User = require('./models/User'),
 config = require('./_config.js');

// Passport local strategy.
passport.use(new Strategy(
  function(username, password, done) {
    User.forge({username: username}).fetch()
    .then((user) => {
      user = user.toJSON();
      if (!user) {
        return done(null, false);
      }
      if (user.password != password) {
        return done(null, false);
      };
      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    })
  }
));


// Passport session persistence.
passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(id, done) {
  User.forge({id: id}).fetch()
  .then((user) => {
    done(null, user);
  })
  .catch((err) => {
    console.log(err);
  });
});

module.exports = passport;
