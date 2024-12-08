const LocalStrategy = require('passport-local').Strategy;
const validator = require('validator');
const Users = require('../models/users');

const strategy = new LocalStrategy(
  {
    usernameField: 'username', // not necessary, DEFAULT
    passwordField: 'password',
  },
  ((username, password, done) => {
    Users.findOne({
      $and: [{ username: validator.normalizeEmail(username) },
        { active: true }],
    }).then((user) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect or inactive user' });
      }
      if (!user.checkPassword(password)) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    }).catch(err => done(err));
  }),
);

module.exports = strategy;
