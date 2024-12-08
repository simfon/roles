/* eslint-disable no-param-reassign */
const express = require('express');

const router = express.Router();
const randomstring = require('randomstring');
const validator = require('validator');
const _ = require('lodash');
const Users = require('../../models/users');
const passport = require('../../passport');
const isAuthenticated = require('../auth');
const sendRegistration = require('../../email/registration');
const PCs = require('../../pc-creator/pcs');

router.post('/', (req, res) => {
  // eslint-disable-next-line prefer-const
  let { username, password } = req.body;
  // ADD VALIDATION
  username = validator.normalizeEmail(username);
  const random = randomstring.generate();
  const user = new Users({
    username,
    password,
    active: false,
    randomstring: random,
  });

  user.save().then((usr) => {
    sendRegistration(usr.username, usr.randomstring);
    return res.send(usr.nickname);
  }).catch(err => res.status(400).send(err.message));
});

router.post(
  '/login',
  passport.authenticate('local'),
  (req, res) => {
    res.send();
  },
);

router.get('/', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

router.post('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.send({ msg: 'logging out' });
  } else {
    res.send({ msg: 'no user to log out' });
  }
});


// Account management routes
router.post('/account/nick', isAuthenticated, (req, res) => {
  const body = _.pick(req.user, ['id']);
  const nick = _.pick(req.body, ['nickname']);
  return Users.findOne({ nickname: nick.nickname }).then((user) => {
    if (user) {
      return res.status(403).send();
    }

    return Users.findById(body.id).then((myUser) => {
      myUser.updateNick(nick.nickname);
      return res.send();
    });
  }).catch(e => res.status(500).send(e.message));
});

router.get('/account/me', isAuthenticated, (req, res) => {
  const body = _.pick(req.user, ['id']);
  return Users.findById(body.id).then((user) => {
    if (user) {
      const filtered = _.pick(user, ['username', 'nickname']);
      return res.send(filtered);
    }

    return res.status(500).send();
  }).catch(e => res.status(500).send(e.message));
});

router.get('/pc', isAuthenticated, (req, res) => {
  const user = _.pick(req.user, ['id']);
  return Users.findOne({ _id: user.id }).then((foundUser) => {
    if (foundUser.playerCharacter) {
      res.send(foundUser.playerCharacter);
    }

    return res.status(404).send();
  }).catch(e => res.status(500).send(e.message));
});

router.post('/pc/create', isAuthenticated, (req, res) => {
  const user = _.pick(req.user, ['id']);
  return Users.findOne({ _id: user.id }).then((foundUser) => {
    if (foundUser.playerCharacter) {
      return res.status(400).send('PC Already Exist');
    }
    const pc = PCs.generate();
    foundUser.playerCharacter = pc;
    return foundUser.save().then(() => res.send()).catch(e => res.status(500).send(e.message));
  });
});

module.exports = router;
