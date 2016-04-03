'use strict'

const Bookshelf = require('../bookshelf'),
      Artist = require('../models/Artist'),
      Genre = require('../models/Genre'),
      User = require('../models/User');

module.exports = {
  indexUsers(req, res) {
    User.forge()
    .fetchAll()
    .then(users => res.status(200).json(users))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    })
  },

  showUser(req, res) {
    if (req.params.id === 'current') {
      return showCurrentUser(req, res);
    }

    User.forge({id: req.params.id})
    .fetch({
      columns: ['id', 'username', 'firstName', 'lastName', 'bio', 'email']
    })
    .then(user => res.status(200).json(user))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    })
  },


  createUser(req, res) {
    User.forge(req.body).save()
    .then(user => res.status(200).json(user))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    })
  },

  updateUser(req, res) {
    let user = User.forge({id: req.params.id})

    user.save(req.body, {patch: true})
    .then(user => res.status(200).json(user))
    .catch(err => console.log(err))
  },

  deleteUser(req, res) {

    let user = User.forge({id: req.params.id})


    user.destroy()
    .then(result => res.status(200).send('User Deleted'))
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error deleting user', err);
    })
  },

  isAuth(req, res, next) {
    if (req.user) {
      next()
    } else {
    res.sendStatus(401);
    }
  },

  isAdmin(req, res, next) {
    if (req.user.admin) {
      next()
    } else {
      res.sendStatus(401);
    }
  },

  createInviteToken(req, res) {
    User.forge({inviteToken: makeInviteToken()}).save()
    .then(user => res.status(200).json(user));
  },

  isInvited(req, res, next) {
    User.forge({inviteToken: req.body.inviteToken}).fetch()
    .then(user => {
      if (user) {
        next()
      } else {
        res.sendStatus(401);
      }
    })

  }
};

const makeInviteToken = () => {
  var t = "";
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i <= 8; i++ )
     t += p.charAt(Math.floor(Math.random() * p.length));

     return t;
}

const showCurrentUser = (req, res) => {
  if (!req.user) res.status(200).send();

  else {

    User.forge({id: req.user.id}).fetch()
    .then(user => res.status(200).json(user))
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
  }
}
