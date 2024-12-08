/* eslint-disable no-underscore-dangle */
const express = require('express');
const _ = require('lodash');
const Lands = require('../../models/lands');
const isAuthenticated = require('../auth');

const router = express.Router();

const landMap = land => ({
  name: land.name,
  text: land.text,
  north: land.north,
  south: land.south,
  east: land.east,
  west: land.west,
});

const opposite = (direction) => {
  switch (direction) {
    default:
      return undefined;
    case 'north':
      return 'south';
    case 'south':
      return 'north';
    case 'east':
      return 'west';
    case 'west':
      return 'east';
  }
};

// Create a Land linked to some other Land
router.post('/create', isAuthenticated, (req, res) => {
  const {
    name,
    text,
    origin,
    direction,
  } = req.body;

  Lands.findOne({ _id: origin }).then((landOrigin) => {
    if (!landOrigin) {
      return res.status(404).send('Origin does not exist');
    }

    if (landOrigin.direction) {
      return res.status(404).send(`Direction ${direction} is in use`);
    }

    const newLand = new Lands({
      name,
      text,
      [opposite(direction)]: landOrigin._id,
      lastActivity: new Date().getTime(),
    });

    landOrigin[direction] = newLand._id;

    const saveNew = newLand.save();
    const saveOrigin = landOrigin.save();

    return Promise.all([saveNew, saveOrigin]).then(() => res.send(newLand));
  }).catch(e => res.status(500).send(e));
});

// Map User position directions
router.get('/directions', isAuthenticated, (req, res) => {
  Lands.findOne({ people: { $in: req.user.id } })
    .then((land) => {
      if (land) {
        return res.send(landMap(land));
      }

      return res.status(404).send('Position not Found');
    })
    .catch(e => res.status(500).send(e.message));
});

// WorldMap
router.get('/worldMap', isAuthenticated, (req, res) => {
  Lands.find()
    .then((lands => res.send(lands.map(land => landMap(land)))))
    .catch(e => res.status(500).send(e.message));
});

// Get User position
router.get('/whereAmI', isAuthenticated, (req, res) => {
  Lands.findOne({ people: { $in: req.user.id } })
    .then((land) => {
      if (land) {
        return res.send({ position: land._id });
      }

      return res.status(404).send('Position not Found');
    })
    .catch(e => res.status(500).send(e.message));
});

// Get Land presents people
router.get('/people', isAuthenticated, (req, res) => {
  Lands.findOne({ people: { $in: req.user.id } })
    .then((land) => {
      if (!land) {
        return res.status(404).send('Unpositioned');
      }

      return res.send({ people: land.people });
    })
    .catch(e => res.status(500).send(e.message));
});

// Move user Around
router.post('/goTo', isAuthenticated, (req, res) => {
  const { direction } = req.body;
  Lands.findOne({ people: { $in: req.user.id } })
    .then((from) => {
      if (!from[direction]) {
        return res.status(404).send(`${direction} empty`);
      }
      return Lands.findOne({ _id: from[direction] })
        .then((to) => {
          if (!to) {
            return res.status(404).send(`${direction} not found`);
          }
          const f = from.outgoing(req.user.id);
          const t = to.incoming(req.user.id);
          return Promise.all([f, t]).then(() => res.send({ position: to._id }));
        });
    });
});
module.exports = router;
