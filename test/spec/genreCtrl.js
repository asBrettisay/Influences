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



  it.skip('should get a list of all genres', (done) => {
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
      .send({name: 'breakfast'})
      .end((e, r) => {
        if (e) throw e;

        r.should.have.status(200);
        r.body.should.be.a('object');
        r.body.should.have.property('message');
        r.body.message.should.equal('Update Successful');

        Genre.forge({id: testGenre.id})
        .fetch()
        .then((genre) => {
          expect(genre.get('name')).to.equal('breakfast');
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


  it('should add an artist as a founder', (done) => {
    let newArtist = makeFake.Artist();
    Artist.forge(newArtist).save()
    .then((artist) => {
      artist = artist.toJSON();
      testGenre = testGenre.toJSON()
      testGenre.founders = [artist]

      chai.request(server)
      .put('/api/genre/' + testGenre.id)
      .send(testGenre)
      .end((e, r) => {
        if (e) throw e;

        r.should.have.status(200);
        r.body.should.be.ok;

        Genre.forge({id: testGenre}).fetch({withRelated: ['founders']})
        .then((genre) => {
          genre = genre.toJSON();
          genre.founders.should.be.a('array');
          expect(genre.founders[0]).to.be.ok;
          done();
        })
      })
    })
  })


  it('should add an artist to a genres artists collection', (done) => {
    Promise.all([
      makeFake.artistAndSave(),
      makeFake.genreAndSave(),
    ])
    .spread((artist, genre) => {
      genre = genre.toJSON();
      artist = artist.toJSON();

      genre.artists = [artist];
      chai.request(server)
      .put('/api/genre/' + genre.id)
      .send(genre)
      .end((e, r) => {

        r.should.have.status(200);

        Genre.forge({id: genre.id}).fetch({withRelated: ['artists']})
        .then(genre => {
          genre = genre.toJSON();
          genre.should.have.property('artists');
          genre.artists.should.be.a('array');
          expect(genre.artists[0]).to.have.property('id');
          expect(genre.artists[0].id).to.equal(artist.id);
          done();
        })
      })
    })
    .catch(err => {console.log(err)});
  })

  it('should add a founder to a genres founders collection', (done) => {
    Promise.all([
      makeFake.artistAndSave(),
      makeFake.genreAndSave()
    ])
    .spread((artist, genre) => {
      genre = genre.toJSON()
      artist = artist.toJSON()

      genre.founders = [artist];

      chai.request(server)
      .put('/api/genre/' + genre.id)
      .send(genre)
      .end((e, r) => {

        r.should.have.status(200)

        Genre.forge({id: genre.id}).fetch({withRelated: ['founders']})
        .then(genre => {
          genre = genre.toJSON();
          genre.should.have.property('founders');
          genre.founders.should.be.a('array');
          expect(genre.founders[0]).to.have.property('id');
          expect(genre.founders[0].id).to.equal(artist.id);
          done();
        })
      })
    })
  })

  it('should add a subgenre', (done) => {
    Promise.all([
      makeFake.genreAndSave(),
      makeFake.genreAndSave()
    ])
    .spread((genre, subgenre) => {
      genre = genre.toJSON();
      subgenre = subgenre.toJSON();
      genre.subgenres = [subgenre];
      chai.request(server)
      .put('/api/genre/' + genre.id)
      .send(genre)
      .end((e, r) => {

        r.should.have.status(200)

        Genre.forge({id: genre.id}).fetch({withRelated: ['subgenres']})
        .then((genre) => {
          genre = genre.toJSON();
          genre.should.have.property("subgenres")
          var s = genre.subgenres;
          s.should.be.a('array');
          expect(s[0]).to.be.ok;
          s[0].should.be.a('object');
          s[0].id.should.equal(subgenre.id);
          done();
        })
      })
    })
  })

  it('should add a root', (done) => {
    Promise.all([
      makeFake.genreAndSave(),
      makeFake.genreAndSave()
    ])
    .spread((root, genre) => {
      root = root.toJSON()
      genre = genre.toJSON()

      genre.root = root;

      chai.request(server)
      .put('/api/genre/' + genre.id)
      .send(genre)
      .end((e, r) => {

        r.should.have.status(200)

        Genre.forge({id: genre.id}).fetch({withRelated: ['root']})
        .then(genre => {
          genre = genre.toJSON();
          expect(genre).to.be.a('object');
          expect(genre).to.have.property('root');
          expect(genre.root).to.have.property('id');
          expect(genre.root.id).to.equal(root.id);
          done();

        })
      })
    })
  })

  it('should make a new genre and add it as a root', (done) => {
    makeFake.genreAndSave()
    .then(root => {
      root = root.toJSON();
      let genre = makeFake.Genre();
      genre.root = root;

      chai.request(server)
      .post('/api/genre/')
      .send(genre)
      .end((e, r) => {

        r.should.have.status(200)
        r.should.have.property('body');
        r.body.should.have.property('id');

        genre = r.body;


        Genre.forge({id: r.body.id}).fetch({withRelated: ['root']})
        .then(genre => {
          genre = genre.toJSON();
          expect(genre).to.be.ok;
          genre.should.have.property('root');
          genre.root.should.be.a('object');
          genre.root.id.should.equal(root.id);

          return Genre.forge({id: root.id}).fetch({withRelated: ['subgenres']})
        })
        .then(root => {
          root = root.toJSON();
          expect(root).to.be.ok;
          root.should.have.property('subgenres');
          root.subgenres.should.be.a('array');
          root.subgenres[0].id.should.equal(genre.id);
          done();
        })
      })
    })
  })



})
