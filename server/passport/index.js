const passport = require('passport');
const LocalStrategy = require('./localStrategy');
const Users = require('../models/users');

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
/* eslint-disable-next-line */
  done(null, { _id: user._id });
});

// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
  Users.findOne(
    { _id: id },
    { nickname: 1, notify: 1, points: 1 },
    (err, user) => {
      done(null, user);
    },
  );
});

//  Use Strategies
passport.use(LocalStrategy);

module.exports = passport;
