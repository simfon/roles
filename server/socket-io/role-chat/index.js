const { ObjectID } = require('mongodb');
const passportSocketIo = require('passport.socketio');
const _ = require('lodash');
const Games = require('../../models/games');
const Users = require('../../models/users');
const { pushToUsers } = require('../push-notifications');
const { throwDice, generateResult } = require('../utils');

module.exports = (io, socket) => {
  socket.on('join', (params) => {
    socket.join(params.game);
    io.to(params.game).emit('updateUserList');
  });

  socket.on('leave', (params) => {
    io.to(params.game).emit('updateUserList');
  });

  socket.on('SEND_MESSAGE', (params) => {
    const sentAt = { sentAt: new Date().getTime() };
    const kind = { kind: 'chat' };
    const userid = socket.request.user._id;
    let filterParams = _.pick(params, ['game', 'sender', 'text']);
    filterParams = { ...params, ...sentAt, ...kind };

    if (filterParams.game) {
      io.to(filterParams.game).emit('RECEIVE_MESSAGE', params);
      Games.findById(params.game)
        .then((game) => {
          const participants = game.participants.filter(p => p.userid !== userid.toString())
            .map(p => ObjectID(p.userid));
          pushToUsers(participants, params);
          return game.addMessage(params, socket.request.user._id);
        })
        .catch();
    }
  });

  socket.on('ATTACK_DEFEND', (params) => {
    const message = _.pick(params, ['_id', 'game', 'sentAt', 'resolved', 'sender', 'target']);
    // console.log(message);
    // eslint-disable-next-line consistent-return
    Games.findById(message.game).then((game) => {
      const sender = game.participants.find(p => p._id.toString() === message.sender.id);
      //  If the Sender has left, resolve and delete without combat
      if (!sender) {
        return game.updateOne({
          $pull: {
            actions: { _id: message._id },
          },
        }).then(() => (io.to(message.game).emit('updateUserList')));
      }
      const target = game.participants.find(p => p._id.toString() === message.target.id);
      let result = {};
      /* eslint-disable*/
        const senderCliche = sender.sheet.find(a => a.name.toUpperCase() === message.sender.with.toUpperCase());
        const targetCliche = target.sheet.find(a => a.name.toUpperCase() === message.target.with.toUpperCase());
        console.log(message.sender.with);
        console.log(sender.sheet);
        // Sword, Dagger and Cloak go Rock Paper Scissor
        if (senderCliche.category !== targetCliche.category) {
          if (senderCliche.category === 'Spirito' && !targetCliche.category === 'Cappa') {
            senderCliche.status += 1;
          }

          if (senderCliche.category === 'Cappa' && !targetCliche.category === 'Spada') {
            senderCliche.status += 1;
          }

          if (senderCliche.category === 'Spada' && !targetCliche.category === 'Spirito') {
            senderCliche.status += 1;
          }
        }
        
        message.sender.roll = throwDice(senderCliche.status);
        message.target.roll = throwDice(targetCliche.status);

        if (message.sender.roll > message.target.roll) {

          result = generateResult(sender.userid, sender._id, target.userid, target._id, message.target.with);
        } else if (message.target.roll > message.sender.roll) {
          result = generateResult(target.userid, target._id, sender.userid, sender._id, message.sender.with);
        } else if (message.target.roll === message.sender.roll) {
          result = 'itsadraw!';
        }

        if (result !== 'itsadraw!') {
          const pg = game.participants.findIndex(pg => pg._id === result.loser.PGid);
          if (pg >= -1) {
            const clicheIndex = game.participants[pg].sheet.findIndex(a => a.name === result.loser.cliche);

            if (clicheIndex >= -1) {
              game.participants[pg].sheet[clicheIndex].status--;
              game.actions[game.actions.length - 1].resolved = true;
              game.save();
            }
          }

          const toSaveMessage = {
            sentAt: new Date().getTime(),
            sender: 'SISTEMA',
            text: `${message.sender.name} ha ${result.winner.PGid === message.sender.id ? 'vinto' : 'perso'} una prova di ${message.sender.with} contro ${message.target.with}`,
            kind: 'attack',
          };

          game.addMessage(toSaveMessage).then(m => true);

          const winners = passportSocketIo.filterSocketsByUser(io, user => user._id.toString() === result.winner.userid);
          winners.forEach((target) => {
            target.emit('ATTACK_MESSAGE', {
              sender: 'SISTEMA',
              text: `Avete vinto la prova, ${message.sender.roll} contro ${message.target.roll}!`,
              kind: 'attack_message',
            });
            target.emit('ATTACK_END');
          });

          const losers = passportSocketIo.filterSocketsByUser(io, user => user._id.toString() === result.loser.userid);
          losers.forEach((target) => {
            target.emit('ATTACK_MESSAGE', {
              sender: 'SISTEMA',
              text: `Avete perso la prova, ${message.sender.roll} contro ${message.target.roll}`,
              kind: 'attack_message',
            });
            target.emit('ATTACK_END');
          });
        } else {
          io.to(message.game).emit('ATTACK_MESSAGE', {
            sender: 'SISTEMA',
            text: `Pareggio, ${message.sender.roll} contro ${message.target.roll}!`,
            kind: 'attack_message',
          });
          target.emit('ATTACK_END');
        }
        io.in(message.game).emit('ATTACK_END');
      }).catch(e => console.log(e));
    });
    
    /* eslint-enable */
  socket.on('ATTACK_INIT', (params) => {
    const sentAt = { sentAt: new Date().getTime() };
    const resolved = { resolved: false };
    let message = _.pick(params, ['sender', 'target', 'game', 'kind']);
    message = { ...sentAt, ...message, ...resolved };
    Games.findById(message.game).then((game) => {
      const targetPg = game.participants.find(p => p._id.toString() === message.target.id);

      if (targetPg) {
        // new entry in Actions db
        game.addAction(message).then(() => true);

        // update the attacker
        const attackMessage = {
          sentAt: message.sentAt,
          text: `${message.sender.name} sfida ${targetPg.name} con ${message.sender.with}`,
          sender: 'Sistema',
          kind: 'attack',
        };

        game.addMessage(attackMessage).then(() => true);

        socket.emit('ATTACK_MESSAGE', {
          text: `Sfidate ${targetPg.name} con ${message.sender.with}`,
          sender: 'SISTEMA',
          kind: 'attack_message',
        });

        // begin the attacking state
        const targets = passportSocketIo.filterSocketsByUser(
          // eslint-disable-next-line no-underscore-dangle
          io, user => user._id.toString() === targetPg.userid,
        );
        targets.forEach((target) => {
          target.emit('ATTACK_MESSAGE', {
            sender: 'SISTEMA',
            text: `${message.sender.name} vi sfida con ${message.sender.with}`,
            kind: 'attack_message',
          });
        });
        // lock the Game
        io.in(message.game).emit('ATTACK_START', message);
      }
    }).catch();
  });

  socket.on('requestHint', (params) => {
    const request = _.pick(params, ['game']);
    request.user = socket.request.user._id.toString();
    Games.findById(request.game).then((game) => {
      const pg = game.participants.find(obj => obj.userid === request.user);

      socket.emit('hint', {
        sender: 'SISTEMA',
        text: `La tua Storia: ${game.hints[pg.hint]}`,
        kind: 'hint',
      });
    }).catch();
  });

  socket.on('requestStop', (params) => {
    const request = _.pick(params, ['game']);
    request.user = socket.request.user._id.toString();
    Games.findById(request.game).then((game) => {
      if (game.closure.requested.indexOf(request.user) < 0) {
        game.closure.requested.push(request.user);

        const message = {
          sender: 'SISTEMA',
          text: 'Un Personaggio ha richiesto la Fine della Role.',
          kind: 'attack_message',
        };

        io.in(request.game).emit('ATTACK_MESSAGE', message);

        // Evaluate if to Lock the game, ask for honors and give exp
        const participants = game.participants.length;
        const closures = game.closure.requested.length;

        if (closures >= (participants / 2)) {
          const closure = {
            sender: 'SISTEMA',
            text: 'La Role è Terminata.',
            kind: 'attack_message',
          };
          io.in(request.game).emit('ATTACK_MESSAGE', closure);
          
          const action = {
            sentAt: new Date().getTime(),
            resolved: false,
          };
          // eslint-disable-next-line no-param-reassign
          game.closure.closed = true;
          game.addAction(action);
        }

        return game.save();
      }

      const message = {
        sender: 'SISTEMA',
        text: 'Hai già richiesto la Fine della Role.',
        kind: 'attack_message',
      };

      return socket.emit('ATTACK_MESSAGE', message);
    }).catch(e => console.log(e));
  });

  socket.on('Medals', (params) => {
    const userid = socket.request.user._id.toString();
    Games.findOne({ _id: ObjectID(params.gameId), 'participants.userid': userid }).then((game) => {
      if (!game) {
        throw new Error('Game not Found');
      }

      if (game.closure.casted.find(o => o === userid)) {
        console.log(game.closure.casted.find(o => o === userid));
        console.log('hmmm');
        return false;
      }

      const baseXP = Math.floor(game.chat.length / game.participants.length);

      const updateUsers = params.votes.map((vote) => {
        let voteValue = 0;
        const voted = game.participants.find(p => p._id.toString() === vote.id);
        if (vote.vote > 3 || vote.vote < 1) {
          voteValue = 0;
        } else {
          voteValue = parseInt(vote.vote, 10);
        }

        const XP = Math.floor(baseXP + (baseXP / 10 * voteValue)) + throwDice(1, 15);
        return Users.updateOne({ _id: ObjectID(voted.userid) }, { $inc: { points: XP } });
      });

      Promise.all(updateUsers);
      game.closure.casted.push(userid);
      if (game.closure.casted.length >= game.participants.length) {
        return Games.deleteOne({ _id: game._id }).then(() => true);
      }

      return game.save().then(() => true);
      // return Promise.all(updateUsers).then(r => console.log(r)).catch(e => console.log(e));
    }).catch(e => e.message);
  });
};
