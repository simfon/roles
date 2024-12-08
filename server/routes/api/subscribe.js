/*eslint-disable*/
const express = require('express');
const isAuthenticated = require('../auth');
const { User } = require('../../models/users');
const webpush = require('web-push');
const { ObjectID } = require('mongodb');

const router = express.Router();
webpush.setVapidDetails('mailto:info@roles.pw', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
// Post route of subscribe url is as http://host:3000/subscribe

router.delete('/', isAuthenticated, (req, res) => {
  const userid = ObjectID(req.user._id);
  return User.findOne({_id: userid}).then((user) => {
    return user.stopSubscriptions().then(result => res.send(result));
  }).catch(e=>res.status(500).send(e.message));
});

router.post('/', isAuthenticated, (req, res) => {
  const subscription = req.body;
  const userid = ObjectID(req.user._id);
  return User.findOne({_id: userid}).then((user) => {
    if (!user) {
      return res.status(400).send();
    }
    const userSubscriptions = user.subscriptions.map(obj => obj.endpoint)
    if(!userSubscriptions.includes(subscription.endpoint)){
      user.addSubscription(subscription)
    } 
    
    return res.send();
  }).catch(e=>res.status(500).send(e.message));
});

module.exports = router;
