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

const agent = chai.request.agent(server);



describe('artistCtrl', () => {


  var testArtist,
      testGenre,
      testFounder,
      testUser,
      testAdmin,
      session,
      testUserPassword,
      testAdminPassword;


  before((done) => {
    migrate.rollback()
    .then(() => {
      done()
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
      ])
    })
    .spread((a, g, f) => {
      testArtist = a;
      testGenre = g;
      testFounder = f;

      return Promise.all([
        g.artists().attach([g.id, f.id]),
        g.founders().attach(f),
        f.proteges().attach(a),
        makeFake.UserAndSave(),
        makeFake.UserAndSave()
      ]);
    })
    .then(a => {
      testUser = a[3].user
      testAdmin = a[4].user
      testUserPassword = a[3].password
      testAdminPassword = a[4].password
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

  function login() {
    testUser = testUser.toJSON();
    testUser.password = testUserPassword;
    return agent.post('/login').send(testUser)
  }

  it('should show all artists', (done) => {
    Artist.forge(makeFake.Artist()).save()
    .then(() => {

      return login()
    .then(value => {
      agent
        .get('/api/artist/')
        .end((e, r) => {
          if (e) throw e;

          r.should.have.status(200)
          r.body.should.be.a('array');
          r.body[0].should.have.property('fullName')
          done();
        })
      })
    })
  });
  it('should show one artist', (done) => {
    login()
    .then(() => {
      agent
      .get('/api/artist/' + testFounder.id)
      .end((e, r) => {
        if (e) throw e;
        r.should.have.status(200)
        r.body.should.be.a('object');
        r.body.should.have.property('fullName');
        r.body.fullName.should.equal(testFounder.get('fullName'));

        r.body.should.have.property('genre');
        let g = r.body.genre;
        g.should.be.a('array');
        expect(g[0]).to.be.ok;

        r.body.should.have.property('proteges');

        let p = r.body.proteges;
        p.should.be.a('array');
        expect(p[0]).to.be.ok;

        r.body.should.have.property('mentors');

        r.body.mentors.should.be.a('array');

        done();
      })
    })

  });


  it('should create an artist with existing genre', (done) => {
    var newArtist = makeFake.Artist();
    newArtist.genre = [testGenre.toJSON()];


    login()
    .then(() => {
      agent
      .post('/api/artist/')
      .send(newArtist)
      .end((e, r) => {
        if (e) throw e;


        r.should.have.status(200);
        r.body.should.be.a('object');
        r.body.should.have.property('fullName');
        r.body.fullName.should.equal(newArtist.fullName);

        Artist.where({id: r.body.id})
          .fetch({withRelated: 'founder'})
        .then((artist) => {
          artist = artist.toJSON();
          let founder = artist.founder;
          expect(founder[0].name).to.equal(testGenre.get('name'));
          expect(artist.fullName).to.equal(newArtist.fullName);
          done();
        })
      })
    })

  });


  it('should update one artist', (done) => {
    testUser = testUser.toJSON();
    testUser.password = testUserPassword;
    testArtist.genre = [testGenre];
    agent.post('/login').send(testUser)
    .end(user => {
      console.log('Logged in with', user);
      agent.put('/api/artist/' + testArtist.id)
      .send({
          fullName: 'test',
          genre: [testGenre],
          mentors: [testFounder], proteges: []
        })
      .end((e, r) => {
        if (e) throw e;

        r.should.have.status(200)

        Artist.forge({id: testArtist.id}).fetch()
        .then((artist) => {
          expect(artist.get('fullName')).to.be.ok;
          expect(artist.get('fullName')).to.not.equal(testArtist.get('fullName'));
          done();
        })
      })
    })

  });
  it('should delete an artist', (done) => {
    login()
    .then(() => {
      agent
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
    })
  });

  it.skip('should add proteges to an artist', (done) => {

    Promise.all([
      makeFake.artistAndSave(),
      makeFake.artistAndSave(),
      makeFake.artistAndSave(),
    ])
    .spread((newArtist, protege1, protege2) => {
      newArtist = makeFake.relationships(newArtist);

      chai.request(server)
      .put('/api/artist/' + newArtist.id)
      .send({proteges: [protege1, protege2]})
      .end((e, r) => {

        r.should.have.status(200)

        return Artist.forge({id: newArtist.id})
                .fetch({
                  withRelated: [
                    'proteges'
                  ]
                })

      })
      .then((artist) => {
        let proteges = artist.related('proteges');
        proteges.should.be.a('array');
        proteges[0].should.be.ok;
        done();
      })
    })
  })

  it('should remove a mentor', (done) => {
    let mentor, protege;
    Promise.all([
      makeFake.artistAndSave(),
      makeFake.artistAndSave()
    ])
    .spread((_protege, _mentor) => {
      mentor = _mentor, protege = _protege;
      return protege.mentors().attach(mentor.id);
    })
    .then((result) => {
      result = result.toJSON();
      expect(result[0][mentor.id].add).to.equal(true);

      protege.set('mentors', []);
      protege.set('proteges', []);
      protege.set('genre', []);

      login()
      .then(() => {
        agent
        .put('/api/artist/' + protege.id)
        .send(protege)
        .end((e, r) => {
          if (e) console.log(e);

          r.should.have.status(200);

          Artist.forge({id: protege.id})
          .fetch({
            withRelated: ['proteges', 'mentors']
          })
          .then((artist) => {
            let mentors = artist.related('mentors').toJSON();

            expect(mentors).to.be.a('array');
            expect(mentors[0]).to.equal(undefined);
            done();
          })
        })
      })


    })
  })

  it('should remove a founder from the collection', (done) => {
    let artist, genre;
    Promise.all([
      makeFake.artistAndSave(),
      makeFake.genreAndSave(),
    ])
    .spread((_artist, _genre) => {
      artist = _artist
      genre = _genre
      return genre.related('founders').attach(artist.id)
    })
    .then(founders => {
      genre.founders = [];

      login()
      .then(() => {
        agent
        .put('/api/genre/' + genre.id)
        .send(genre)
        .end((e, r) => {

          r.should.have.status(200)

          Genre.forge({id: genre.id}).fetch({withRelated: ['founders']})
          .then(_genre => {
            _genre = _genre.toJSON();
            _genre.id.should.equal(genre.id)
            _genre.should.have.property('founders');
            _genre.founders.should.be.a('array');
            expect(_genre.founders[0]).to.not.be.ok;
            done();
          })
        })
      })

    })
  })
})
