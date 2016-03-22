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

describe('artistCtrl', () => {


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

  it('should show all artists', (done) => {
    Artist.forge(makeFake.Artist()).save()
    .then(() => {
      chai.request(server)
      .get('/api/artist/')
      .end((e, r) => {
        if (e) throw e;

        r.should.have.status(200)
        r.body.should.be.a('array');
        r.body[0].should.have.property('name')
        done();
      })
    })
  });
  it('should show one artist', (done) => {
    chai.request(server)
    .get('/api/artist/' + testArtist.id)
    .end((e, r) => {
      if (e) throw e;

      r.should.have.status(200)
      r.body.should.be.a('object');
      r.body.should.have.property('name');
      r.body.name.should.equal(testArtist.get('name'));
      done();
    })
  });
  it('should create an artist', (done) => {
    var newArtist = makeFake.Artist();
    chai.request(server)
    .post('/api/artist/')
    .send(newArtist)
    .end((e, r) => {
      if (e) throw e;

      r.should.have.status(200);
      r.body.should.be.a('object');
      r.body.should.have.property('name');
      r.body.name.should.equal(newArtist.name);

      Artist.forge({id: r.body.id}).fetch()
      .then((artist) => {
        expect(artist.get('name')).to.equal(newArtist.name);
        done();
      })
    })
  });
  it('should update one artist', (done) => {
    chai.request(server)
    .put('/api/artist/' + testArtist.id)
    .send({name: 'test'})
    .end((e, r) => {
      if (e) throw e;

      r.should.have.status(200)

      Artist.forge({id: testArtist.id}).fetch()
      .then((artist) => {
        expect(artist.get('name')).to.not.equal(testArtist.get('name'));
        done();
      })
    })
  });
  it('should delete an artist', (done) => {
    chai.request(server)
    .delete('/api/artist/' + testArtist.id)
    .end((e, r) => {
      if (e) throw e;

      r.should.have.status(200)

      Artist.forge({id: testArtist.id})
      .fetch()
      .then((artist) => {
        expect(artist).to.equal(null);
        done();
      })
    })
  });

  it('should not delete an artist with wrong id', (done) => {
    chai.request(server)
    .delete('/api/artist/bears')
    .end((e, r) => {

      r.should.have.status(500)

      Artist.forge({id: testArtist.id}).fetch()
      .then((artist) => {
        expect(artist).to.be.ok;
        done();
      })
    })
  })
})
