/* eslint-disable */
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Users = require('../../models/users');
const Lands = require('../../models/lands');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();

const landOne = new ObjectID();
const landTwo = new ObjectID();

const lands = [{
  _id: landOne,
  name: 'Stanza Uno',
  north: landTwo,
  people: [userTwoId],
},{
  _id: landTwo,
  name: 'Stanza Due',
  south: landOne,
}]

const users = [{
  _id: userOneId,
  username: 'simone@simone.com',
  password: 'userOnePass',
  active: true,
  nickname: 'tall-bear-999',

}, {
  _id: userTwoId,
  username: 'second@user.com',
  password: 'userTwoPass',
  active: true,
  nickname: 'short-bear-999',
},{
  _id: userThreeId,
  username: 'pluto@simone.com',
  password: 'userThreePass',
  active: false,
  nickname: 'fuzzy-bear-999',
  randomstring: 'ajumptotheleft'
}];

const populateLands = (done) => {
  Lands.deleteMany({}).then(() => {
    const landOne = new Lands(lands[0]).save();
    const landTwo = new Lands(lands[1]).save();
    return Promise.all([landOne, landTwo]);
  }).then(() => done()).catch(e => done(e));
}

const populateUsers =  (done) => {
  Users.deleteMany({}).then(() => {
    const userOne = new Users(users[0]).save();
    const userTwo = new Users(users[1]).save();
    const userThree = new Users(users[2]).save();
    return Promise.all([userOne, userTwo, userThree]);
  }).then(() => done()).catch(e => done(e));
};

module.exports = {
  users,
  lands,
  populateUsers,
  populateLands,
};
