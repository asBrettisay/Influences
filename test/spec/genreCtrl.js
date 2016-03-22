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
  knex = require('knex')(config.test),
  migrate = knex.migrate;

chai.use(chaiHttp);

describe('genreCtrl', () => {



  var testArtist, testGenre;
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
      return Genre.forge(makeFake.Genre()).save()
    })
    .then((_testGenre) => {
      testGenre = _testGenre;
      return Artist.forge(makeFake.Artist()).save()
    })
    .then((_testArtist) => {
      testArtist = _testArtist;
      done();
    })
    .catch((err) => {
      console.log(err);
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



  it('should get a list of all genres', (done) => {
    Genre.forge(makeFake.Genre()).save()
    .then((artist) => {
      chai.request(server)
      .get('/api/genre/')
      .end((e, r) => {
        if (e) console.log(e);

        r.should.have.status(200);
        r.should.have.property('body');
        r.body[0].should.have.property('name');
        done();
      })
    })
  });
  it('should get one genre', (done) => {
    Genre.forge(makeFake.Genre()).save()
    .then((genre) => {
      chai.request(server)
      .get('/api/genre/' + genre.id)
      .end((e, r) => {
        if (e) throw e;
        r.should.have.status(200)
        r.should.have.property('body');
        r.body.should.have.property('name');
        r.body.name.should.equal(genre.get('name'));
        done();
      })
    })
  });
  it('should create a new genre', (done) => {
    var genre = makeFake.Genre();
    chai.request(server)
      .post('/api/genre/')
      .send(genre)
      .end((e, res) => {
        if (e) throw e;

        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('name')
        res.body.name.should.equal(genre.name);
        done();
      })
  });
  it('should update an existing genre', (done) => {
    chai.request(server)
      .put('/api/genre/' + testGenre.id)
      .send({name: 'test'})
      .end((e, r) => {
        if (e) throw e;

        r.should.have.status(200);
        r.body.should.be.a('object');
        r.body.should.have.property('message');
        r.body.message.should.equal('Update Successful');

        Genre.forge({id: testGenre.id})
        .fetch()
        .then((genre) => {
          expect(genre.get('name')).to.equal('test');
          done();
        })

      })
  });
  it('should delete a genre', (done) => {
    chai.request(server)
      .delete('/api/genre/' + testGenre.id)
      .end((e, r) => {
        r.should.have.status(200)
        r.body.should.have.property('message')
        r.body.message.should.equal('Genre deleted')

        Genre.forge({id: testGenre.id})
        .fetch()
        .then((result) => {
          expect(result).to.equal(null);
          done();
        })
      })
  });

  it('should not delete anything if id is incorrect', (done) => {
    chai.request(server)
    .delete('/api/genre/' + testGenre.id + 'bears')
    .end((e, r) => {
      r.should.have.status(500)
      r.should.have.property('body');
      r.body.should.have.property('message');

      Genre.forge({id: testGenre.id})
      .fetch()
      .then((genre) => {
        expect(genre.get('name')).to.equal(testGenre.get('name'));
        done();
      })
    })
  })
})
