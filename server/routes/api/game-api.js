/* eslint-disable no-underscore-dangle */
const express = require('express');
const _ = require('lodash');
const Games = require('../../models/games');
const Stories = require('../../models/stories');
const Users = require('../../models/users');
const PCs = require('../../pc-creator/pcs');
const isAuthenticated = require('../auth');

const router = express.Router();

const pickOne = (options) => {
  const randomNum = Math.floor(Math.random() * options.length);
  const option = options[randomNum];
  return option;
};

const filterGame = (game, isOwner, lastActivity, name) => ({
  _id: game._id,
  gameName: game.gameName,
  gameLocation: game.locationName,
  img: game.img,
  story: game.story,
  maxParticipants: game.maxParticipants,
  activity: game.participants.map(obj => obj.lastActivity),
  owner: isOwner,
  lastActionTime: game.lastActionTime,
  myLastActivity: lastActivity,
  name,
});

// Get all the games registered to the user
router.get('/games', isAuthenticated, (req, res) => {
  Games.find({ 'participants.userid': req.user.id }).then((games) => {
    if (games) {
      const notClosed = games.filter(game => !game.closure.casted.includes(req.user.id));
      const outGames = notClosed.map((game) => {
        const owner = game.participants[0].userid === req.user.id;
        const pg = game.participants.find(obj => (
          obj.userid === req.user.id
        ));
        return filterGame(game, owner, pg.lastActivity, pg.name);
      });
      return res.send(outGames);
    }
    return res.status(400).send();
  }).catch(e => res.status(500).send(e.message));
});

// Get a count of games with free slots
router.get('/games/count', isAuthenticated, (req, res) => (
  Games.find({
    $and:
          [{ 'participants.userid': { $nin: [req.user.id] } },
            { 'closure.casted': { $nin: [req.user.id] } },
            { 'closure.closed': { $eq: false } },
            { currentSlots: { $gt: 0 } }],
  }).countDocuments()
    .then((openGames) => {
      if (openGames) {
        return res.send(openGames.toString());
      }
      return res.send('0');
    })
    .catch(e => res.status(400).send(e))
));

// Join a simple game
router.post('/joinSimple', isAuthenticated, (req, res) => (
  Games.aggregate([{
    $match: {
      $and:
      [{ 'participants.userid': { $nin: [req.user.id] } },
        { 'closure.casted': { $nin: [req.user.id] } },
        { 'closure.closed': { $eq: false } },
        { currentSlots: { $gt: 0 } },
        { type: { $eq: 'one-shot' } }],
    },
  },
  { $sample: { size: 1 } }])
    .then((gameFound) => {
      if (gameFound.length === 0) {
        return res.status(400).send();
      }
      return Games.findById(gameFound[0]._id).then((game) => {
        const pc = PCs.generate();
        let hint = 0;
        const checkHints = pg => pg.hint === hint;

        while (gameFound[0].participants.some(checkHints)) {
          hint = Math.floor(Math.random() * gameFound[0].maxParticipants);
        }
        const obj = {
          userid: req.user.id,
          hint,
          name: pc.name,
          gender: pc.gender,
          lastActivity: new Date().getTime(),
          sheet: pc.sheet,
          traits: pc.traits,
          desires: pc.desires,
        };
        game.participants.push(obj);
        // eslint-disable-next-line no-param-reassign
        game.currentSlots -= 1;

        return game.save().then(savedGame => res.send(filterGame(savedGame, false)));
      });
    })
    .catch(e => res.status(400).send(e.message))
));

// Create a n players games from Stories
router.post('/createGame', isAuthenticated, (req, res) => {
  const loggedUser = _.pick(req.user, ['id']);
  const body = _.pick(req.body, ['maxPlayers']);
  const maxP = parseInt(body.maxPlayers, 10);
  if (!body.maxPlayers) {
    return res.status(400).send();
  }
  return Stories.aggregate([{
    $match: {
      $and:
        [{ 'stories.maxPlayers': { $lte: maxP } },
          { 'stories.type': { $eq: 'one-shot' } }],
    },
  }, { $sample: { size: 1 } }])
    .then((stories) => {
      // Prepare the picked random story
      const story = stories[0];
      story.stories = pickOne(story.stories.filter(s => s.maxPlayers <= maxP));

      // Get the requesting user, use his params to setup the New Game
      return Users.findById(loggedUser.id).then((user) => {
        const pc = PCs.generate();
        const now = new Date().getTime();
        const game = {
          gameName: story.stories.title,
          locationName: story.location.name,
          locationDescription: story.location.description,
          createdAt: now,
          lastActionTime: now,
          story: story.stories.synopsis,
          maxParticipants: body.maxPlayers,
          currentSlots: body.maxPlayers - 1,
          participants: [],
          hints: story.stories.hints,
          starter: story.stories.starter,
          img: story.location.img,
        };

        const obj = {
          userid: user._id,
          hint: Math.floor(Math.random() * game.maxParticipants),
          name: pc.name,
          gender: pc.gender,
          lastActivity: new Date().getTime(),
          sheet: pc.sheet,
          traits: pc.traits,
          desires: pc.desires,
        };

        game.participants.push(obj);
        return new Games(game).save().then((newGame) => {
          // console.log('A new game has spawned', newGame._id);
          newGame.addMessage({
            game: newGame._id,
            sender: 'SISTEMA',
            text: newGame.starter,
            kind: 'hint',
          }).then(() => true);
          return res.send(filterGame(newGame, true));
        });
      });
    }).catch(e => res.status(400).send(e.message));
});

// Get game params by id
router.get('/:id', isAuthenticated, (req, res) => (
  Games.findById(req.params.id).then(game => res.send(game))
    .catch(e => res.status(400).send(e.message))
));

// Get game chat by id
router.get('/chat/:id', isAuthenticated, (req, res) => {
  Games.findById(req.params.id).then((game) => {
    const chat = _.pick(game, ['chat']);
    return res.send(chat);
  }).catch(e => res.status(400).send(e.message));
});

// Get game actions by id
router.get('/actions/:id', isAuthenticated, (req, res) => {
  Games.findById(req.params.id).then((game) => {
    const chat = _.pick(game, ['actions']);
    return res.send(chat);
  }).catch(e => res.status(400).send(e.message));
});

// Get game participants by id
router.get('/participants/:id', isAuthenticated, (req, res) => {
  Games.findById(req.params.id).then((game) => {
    const chat = _.pick(game, ['participants']);
    return res.send(chat);
  }).catch(e => res.status(400).send(e.message));
});

// Delete a game by ID if user is Owner
router.delete('/:id', isAuthenticated, (req, res) => {
  Games.findById(req.params.id).then((game) => {
    if (game.participants[0].userid === req.user.id) {
      Games.findByIdAndDelete(req.params.id)
        .then(() => res.send()).catch(e => res.status(400).send(e.message));
      // console.log('A game has been deleted', game._id);
    }
  }).catch(e => res.status(400).send(e.message));
});

// Leave a game by ID if user is participant
router.post('/leave/:id', isAuthenticated, (req, res) => {
  const body = _.pick(req.user, ['id']);
  Games.findById(req.params.id).then((game) => {
    const toDelete = game.participants.find(pg => pg.userid === body.id);

    const isZero = game.participants[0]._id;
    if (toDelete && toDelete._id !== isZero) {
      game.updateOne(
        {
          $pull: { participants: { _id: toDelete._id } },
          $inc: { currentSlots: 1 },
        },
      ).then(() => res.send())
        .catch(e => res.status(400).send(e.message));
    }
  }).catch(e => res.status(400).send(e.message));
});

// Get the user controlled PG id in Game
router.post('/pg/:id', isAuthenticated, (req, res) => {
  const body = _.pick(req.user, ['id']);
  const gameId = _.pick(req.params, ['id']);

  Games.findById(gameId.id).then((game) => {
    const mypg = game.participants.find(pg => pg.userid === body.id);
    if (mypg) {
      return res.send({
        _id: mypg._id,
        name: mypg.name,
        sheet: mypg.sheet,
      });
    }
    return res.status(400).send();
  }).catch(e => res.status(400).send(e));
});

module.exports = router;
