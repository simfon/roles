/* eslint-disable */
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const Users = require('../models/users');
const Games = require('../models/games');
const { users, populateUsers, populateLands } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateLands);

describe('POST /api/user/login', () => {
  it('should login user', (done) => {
    request(app)
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
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/api/user/login')
      .send({
        username: 'second@user.com',
        password: 'asdfwef',
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should reject a not activated user', (done) => {
    request(app)
      .post('/api/user/login')
      .send({
        username: 'pluto@simone.com',
        password: 'userThreePass',
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});

describe('POST /api/user/', () => {
  it('should register a new user', (done) => {
    request(app)
      .post('/api/user')
      .send({
        username: 'third@user.com',
        password: 'thirdUser'
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  })

  it('should reject an invalid e-mail', (done) => {
    request(app)
      .post('/api/user')
      .send({
        username: 'thirduser.com',
        password: 'thirdUser'
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  })

  it('should reject an existing e-mail', (done) => {
    request(app)
      .post('/api/user')
      .send({
        username: 'second@user.com',
        password: 'oijoijoijo'
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  })

  it('should reject a short password', (done) => {
    request(app)
      .post('/api/user')
      .send({
        username: 'fourth@user.com',
        password: 'oi'
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  })
})

describe('GET /account/me/', () => {
  it('should reject a not authenticated request', (done) => {
    request(app)
      .get('/api/user/account/me')
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
    });
})

describe('POST /verify/:id', () => {
  it('should deny an invalid Randomstring', (done) => {
    request(app)
      .get('/verify/thisnotexist')
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should validate a valid Randomstring', (done) => {
    request(app)
      .get('/verify/ajumptotheleft')
      .expect(302)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
})

describe('GET /api/user', () => {
  const authUser = request.agent(app);

  before((done) => {
    authUser
      .post('/api/user/login')
      .send({
        username: 'second@user.com',
        password: 'userTwoPass',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        done();
      })
  });

  it('Should return logged in user details', (done) => {
    authUser
      .get('/api/user/')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      })
  })

});

