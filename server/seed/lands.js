const { ObjectID } = require('mongodb');
const Lands = require('../models/lands');

const uno = new ObjectID();
const due = new ObjectID();
const tre = new ObjectID();
const ids = [uno, due, tre];

const baseLands = [
  {
    _id: ids[0],
    name: 'Piazza',
    text: 'Una grossa fontana di marmo bianco domina il centro dello spiazzo circolare. Un pugno di bancarelle ne colora il versante Nord. La Locanda attende ad Est.',
    north: ids[2],
    east: ids[1],
  },
  {
    _id: ids[1],
    name: 'Locanda',
    text: 'La solita, noiosa Locanda. Ed il cinghiale arrosto non è un granché',
    west: ids[0],
  },
  {
    _id: ids[2],
    name: 'Vicolo stretto',
    text: 'Dalla piazza verso nord',
    south: ids[0],
  },
];


Lands.find().countDocuments().then((n) => {
  if (n === 0) {
    baseLands.map(land => new Lands(land).save());
  }
});
