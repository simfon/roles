/* eslint-disable */
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const User = require('../models/users');
const Lands = require('../models/lands');
const { users, lands, populateUsers, populateLands } = require('./seed/seed');

const authUser = request.agent(app);
beforeEach(populateUsers);
beforeEach(populateLands);
beforeEach((done) => {
  authUser
      .post('/api/user/login')
      .send({
        username: 'second@user.com',
        password: 'userTwoPass',
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      })
});

describe('GET /whereAmI', () => {
  it('Should return correct user position', (done) => {
    authUser
      .get('/api/lands/whereAmI')
      .expect(200)
      .end((err, res) => {
          expect(res.body.position).toBe(lands[0]._id.toHexString());
        if (err) {
          return done(err);
        }
        return done();
      })
  });

  it('Should not return unauthenticated user position (401)', (done) => {
    request(app)
      .get('/api/lands/whereAmI')
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      })
  })
});

describe('POST /goTo', () => {
  it('Should move to the North', (done) => {
    authUser
      .post('/api/lands/goTo')
      .send({direction: 'north'})
      .expect(200)
      .end((err, res) => {
        expect(res.body.position).toBe(lands[1]._id.toHexString());
        Lands.findOne({ _id: lands[0]._id }).then( land => expect(land.people.length).toBe(0))
          .catch(e => e);
      if (err) {
        return done(err);
      }
      return done();
    });
  });

  it('Should not move to unexisting direction', (done) => {
    authUser
      .post('/api/lands/goTo')
      .send({direction: 'southwest'})
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});

describe('GET /people', () => {
  it('Should return peoples in location as an Array', (done) => {
    authUser
      .get('/api/lands/people')
      .expect(200)
      .end((err, res) => {
        expect(res.body.people).toBeTruthy();
        expect(typeof(res.body.people)).toBe('object');
        expect(res.body.people[0]).toBe(users[1]._id.toHexString())
        if (err) {
          return done(err);
        }
        return done();
        }
      );
  });
});

describe('GET /directions', () => {
  it('Should return directions for current Land', (done) => {
    authUser
      .get('/api/lands/directions')
      .expect(200)
      .end((err, res) => {
        expect(res.body).toBeTruthy();
        expect(res.body.north).toBe(lands[1]._id.toHexString());
        if (err) {
          return done(err);
        }
        return done();
        }
      ); 
  });
});

describe('GET /worldMap', () => {
  it('Should return a worldMap array of Objects with directions and names', (done) => {
    authUser
      .get('/api/lands/worldMap')
      .expect(200)
      .end((err, res) => {
        expect(res.body).toBeTruthy();
        expect(res.body[0].name).toBeTruthy();
        expect(res.body[0].name).toBe(lands[0].name);
        expect(res.body[1].south).toBe(lands[1].south.toHexString());
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});

describe('POST /create', () => {

  it('Should create a new linked land and move to it', (done) => {
    const data = {
      name: 'Land Tre',
      text: 'Bel posto',
      direction: 'east',
      origin: lands[0]._id,
    };

    authUser
      .post('/api/lands/create')
      .send(data)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toBeTruthy();
        expect(res.body.west).toBe(lands[0]._id.toHexString());
        expect(res.body.name).toBe(data.name);
        expect(res.body.text).toBe(data.text);
        const newLand = res.body;
        authUser
          .post('/api/lands/goTo')
          .send({direction: 'east'})
          .expect(200)
          .end((err, res) => {
            expect(res.body.position).toBe(newLand._id.toHexString());
            if (err) {
              return done(err);
            }
            return done();
          })
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});