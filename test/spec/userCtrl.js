'use strict'

const
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  config = require('../../knexfile.js'),
  server = require('../../index'),
  Faker = require('faker'),
  makeFake = require('../helpers/fakers'),
  Promise = require('bluebird');

const
  should = chai.should(),
  expect = chai.expect,
  Genre = require('../../models/Genre'),
  Artist = require('../../models/Artist'),
  User = require('../../models/User'),
  knex = require('knex')(config.test),
  migrate = knex.migrate;

chai.use(chaiHttp);

describe('userCtrl', () => {


  let testUser1, testUser2, newUser;
  before((done) => {
    migrate.rollback()
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    })
  });

  beforeEach((done) => {
    migrate.latest()
    .then(() => {
      newUser = makeFake.User();
      return Promise.all([
        makeFake.UserAndSave(),
        makeFake.UserAndSave()
      ])
    })
    .then((users) => {
      testUser1 = users[0]
      testUser2 = users[1]
      done();
    })
  })

  afterEach((done) => {
    migrate.rollback()
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    })
  })


  it('should show all users', (done) => {
    chai.request(server)
    .get('/api/users/')
    .end((e, r) => {
      if (e) throw e;
      r.should.have.status(200);
      r.body.should.be.a('array');
      r.body[0].should.be.ok;
      done();
    })
  });


  it('should show one user', (done) => {
    chai.request(server)
    .get('/api/users/' + testUser1.id)
    .end((e, r) => {
      if (e) throw e;

      r.should.have.status(200);
      r.body.should.be.a('object');
      r.body.username.should.equal(testUser1.get('username'));
      done();
    })
  });


  it('should create a user', (done) => {
    chai.request(server)
    .post('/api/users/')
    .send(newUser)
    .end((e, r) => {
      if (e) throw e;

      r.should.have.status(200);
      r.body.should.be.a('object');
      r.body.username.should.equal(newUser.username);

      User.forge({id: r.body.id}).fetch()
      .then((user) => {
        expect(user.get('username')).to.equal(newUser.username);
        done();
      })
    })
  });


  it('should update a user', (done) => {
    chai.request(server)
    .put('/api/users/' + testUser1.id)
    .send({email: 'test@example.com'})
    .end((e, r) => {
      if (e) throw e;

      r.should.have.status(200);
      r.body.should.be.a('object');
      r.body.should.have.property('email');
      r.body.email.should.not.equal(testUser1.get('email'));

      User.forge(testUser1.id).fetch()
      .then((user) => {
        expect(user.get('email')).to.not.equal(testUser1.get('email'));
        expect(user.get('username')).to.equal(testUser1.get('username'));
        done();
      })

    })
  });
  it('should delete a user', (done) => {
    chai.request(server)
    .delete('/api/users/' + testUser1.id)
    .end((e, r) => {
      if (e) throw e;

      r.should.have.status(200)

      User.forge({id: testUser1.id}).fetch()
      .then((user) => {
        expect(user).to.not.be.ok;
        done();
      })
    })
  });

  it('should log in a valid user', (done) => {
    let user = makeFake.User()
    let password = user.password;
    user = User.forge(user);

    var promise = new Promise(function(resolve, reject) {
      user.generateHash(password, (err, _user) => {
        resolve(_user.save());
      })
    })

    promise
    .then((user) => {


      chai.request(server)
      .post('/login')
      .send({
        username: user.get('username'),
        password: password
      })
      .end((e, r) => {
        if (e) throw e;

        r.should.have.status(200)
        r.should.have.property('body')
        r.body.should.have.property('message')
        r.body.message.should.equal('ok');
        done();
      })
    })
  })

  it('should sign up a user', (done) => {
    chai.request(server)
    .post('/signup')
    .send(makeFake.User())
    .end((e, r) => {

      r.should.have.status(200)
      r.body.should.be.a('object');
      r.body.should.have.property('message');
      r.body.message.should.equal('ok');
      done();

    })
  })
});
