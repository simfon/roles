/* eslint-disable func-names */
const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    default: 'one-shot',
  },
  locationName: {
    type: String,
    required: true,
  },
  locationDescription: {
    type: String,
    required: true,
  },
  story: {
    type: String,
  },
  createdAt: {
    type: Number,
  },
  lastActionTime: {
    type: Number,
  },
  maxParticipants: {
    type: Number,
  },
  currentSlots: {
    type: Number,
  },
  participants: [{
    userid: {
      type: String,
    },
    lastActivity: {
      type: Number,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
    hint: {
      type: Number,
    },
    traits: [String],
    desires: [String],
    sheet: [{
      name: { type: String },
      category: { type: String },
      text: { type: String },
      level: { type: Number },
      status: { type: Number },
    }],
  }],
  chat: [{
    sentAt: {
      type: Number,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    kind: {
      type: String,
    },
  }],
  actions: [{
    sentAt: {
      type: Number,
      required: true,
    },
    sender: {
      type: Object,
    },
    target: {
      type: Object,
    },
    game: {
      type: String,
    },
    resolved: {
      type: Boolean,
    },
  }],
  hints: [String],
  starter: [String],
  img: {
    type: String,
  },
  closure: {
    requested: [String],
    casted: [String],
    closed: {
      type: Boolean,
      default: false,
    },
    prizes: [{
      userid: String,
      votes: Number,
    }],
  },
  report: {
    reporter: [String],
  },
});

gamesSchema.methods.addAction = function (message) {
  const game = this;
  // console.log(message);
  return game.updateOne({
    $push: { actions: message },
  });
};

gamesSchema.methods.getActions = function () {
  const game = this;
  return game.actions.find().sort({ sentAt: -1 });
};

gamesSchema.methods.updateSlots = function () {
  const game = this;
  game.currentSlots = game.maxParticipants - game.participants.length;
  return game.save().then(() => true)
    .catch(e => e);
};

gamesSchema.methods.addMessage = function (message, userid) {
  const game = this;
  if (userid) {
    const pg = game.participants.find(p => p.userid === userid.toString());
    const now = new Date().getTime();
    pg.lastActivity = now;
    game.lastActionTime = now;
    game.save().then(() => true);
    return game.updateOne({
      $push: {
        chat: {
          sentAt: message.sentAt,
          sender: message.sender,
          text: message.text,
          kind: message.kind,
        },
      },
    });
  }

  return game.updateOne({
    $push: {
      chat: {
        sentAt: message.sentAt,
        sender: message.sender,
        text: message.text,
        kind: message.kind,
      },
    },
  });
};


gamesSchema.methods.getMessages = function (limit) {
  const game = this;
  let maxMessages = 0;
  if (limit) {
    maxMessages = limit;
  }
  return game.chat.find().sort({ sentAt: -1 }).limit(maxMessages);
};


module.exports = mongoose.models.Games || mongoose.model('Games', gamesSchema);
