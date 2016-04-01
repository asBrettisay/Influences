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
const agent = chai.request.agent(server);
describe('userCtrl', () => {


  let testUser, testUser2, newUser, testUserPassword;
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
      testUser = users[0].user
      testUserPassword = users[0].password
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

  function login() {
    testUser = testUser.toJSON();
    testUser.password = testUserPassword;
    return agent.post('/login').send(testUser);
  }


  it('should show all users', (done) => {

    login()
    .then(() => {
      agent
      .get('/api/users/')
      .end((e, r) => {
        if (e) throw e;
        r.should.have.status(200);
        r.body.should.be.a('array');
        r.body[0].should.be.ok;
        done();
      })
    })

  });


  it('should show one user', (done) => {
    login()
    .then(() => {
      agent
      .get('/api/users/' + testUser.id)
      .end((e, r) => {
        if (e) throw e;

        r.should.have.status(200);
        r.body.should.be.a('object');
        r.body.username.should.equal(testUser.username);
        done();
      })
    })

  });


  it('should create a user', (done) => {
    login()
    .then(() => {
      agent
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
    })

  });


  it('should update a user', (done) => {
    login()
    .then(() => {
      agent
      .put('/api/users/' + testUser.id)
      .send({email: 'test@example.com'})
      .end((e, r) => {
        if (e) throw e;

        r.should.have.status(200);
        r.body.should.be.a('object');
        r.body.should.have.property('email');
        r.body.email.should.not.equal(testUser.email);

        User.forge(testUser.id).fetch()
        .then((user) => {
          expect(user.get('email')).to.not.equal(testUser.email);
          expect(user.get('username')).to.equal(testUser.username);
          done();
        })

      })
    })

  });
  it('should delete a user', (done) => {
    login()
    .then(() => {
      agent
      .delete('/api/users/' + testUser.id)
      .end((e, r) => {
        if (e) throw e;

        r.should.have.status(200)

        User.forge({id: testUser.id}).fetch()
        .then((user) => {
          expect(user).to.not.be.ok;
          done();
        })
      })
    })

  });

  it('should log in a valid user', (done) => {
    let user = makeFake.User()
    let password = user.password;
    user = User.forge(user);

    var promise = new Promise(function(resolve, reject) {
      user.generateHash(password, (err, hash) => {
        resolve(user.save({password: hash}));
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

  it.skip('should sign up a user', (done) => {
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
