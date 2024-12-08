
const express = require('express');
const Avatars = require('@dicebear/avatars');
const male = require('@dicebear/avatars-male-sprites');
const female = require('@dicebear/avatars-female-sprites');
const isAuthenticated = require('../auth');

const router = express.Router();

router.get('/male/:seed', isAuthenticated, (req, res) => {
  const options = {};
  // eslint-disable-next-line new-cap
  const avatars = new Avatars.default(male.default(options));
  const svg = avatars.create(req.params.seed);
  res.setHeader('Content-Type', 'image/svg+xml');
  return res.send(svg);
});

router.get('/female/:seed', isAuthenticated, (req, res) => {
  const options = {};
  // eslint-disable-next-line new-cap
  const avatars = new Avatars.default(female.default(options));
  const svg = avatars.create(req.params.seed);
  res.setHeader('Content-Type', 'image/svg+xml');
  return res.send(svg);
});

module.exports = router;
