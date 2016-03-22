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



  var testArtist, testGenre, testFounder;
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
      let a = makeFake.Artist(),
          g = makeFake.Genre(),
          f = makeFake.Artist();

      return Promise.all([
        Artist.forge(a).save(),
        Genre.forge(g).save(),
        Artist.forge(f).save()
      ]);
    })
    .spread((a, g, f) => {
      testArtist = a, testGenre = g, testFounder = f;

      return Promise.all([
        g.artists().attach([a.id, f.id]),
        g.founders().attach(f),
        f.proteges().attach(a)
      ]);
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      throw err;
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
    chai.request(server)
    .get('/api/genre/' + testGenre.id)
    .end((e, r) => {
      if (e) throw e;
      r.should.have.status(200)
      r.should.have.property('body');
      r.body.should.have.property('name');
      r.body.name.should.equal(testGenre.get('name'));
      r.body.should.have.property('founders');

      let f = r.body.founders;
      f.should.be.a('array');
      expect(f[0]).to.be.ok;

      r.body.should.have.property('artists');

      let a = r.body.artists;
      a.should.be.a('array');
      expect(a[0]).to.be.ok;
      done();
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
