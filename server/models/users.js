
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const validator = require('validator');

// Define userSchema
const userSchema = new mongoose.Schema({

  username: {
    type: String,
    unique: true,
    required: false,
    minlength: 6,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    unique: false,
    required: true,
    minlength: 6,
  },
  active: { type: Boolean, required: true, default: false },
  lastLogin: { type: Number },
  nickname: {
    type: String,
    unique: false,
    required: false,
    default: 'place-holder',
  },
  randomstring: { type: String },
  notify: {
    type: Boolean,
    default: false,
  },
  points: {
    type: Number,
    default: 1000,
  },
  subscriptions: [{
    endpoint: String,
    keys: mongoose.Schema.Types.Mixed,
    expirationTime: {
      type: Date,
      default: Date.now,
    },
  }],
  playerCharacters: {
    name: {
      type: String,
    },
    gender: {
      type: String,
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
  },
});

const pickOne = (options) => {
  const randomNum = Math.floor(Math.random() * options.length);
  const option = options[randomNum];
  return option;
};

// Define schema methods

/* eslint-disable func-names */
userSchema.methods.checkPassword = function (inputPassword) {
  return bcrypt.compareSync(inputPassword, this.password);
};

userSchema.methods.hashPassword = plainTextPassword => (
  bcrypt.hashSync(plainTextPassword, 10)
);

userSchema.methods.removeSubscription = function (subscription) {
  const user = this;

  return user.updateOne({
    $pull: {
      subscriptions: { subscription },
    },
  });
};

userSchema.methods.addSubscription = function (subscription) {
  const user = this;
  user.notify = true;
  user.subscriptions.push(subscription);
  return user.save()
    .then(() => subscription)
    .catch(e => e);
};

userSchema.methods.stopSubscriptions = function () {
  const user = this;
  user.subscriptions = [];
  user.notify = false;
  return user.save()
    .then(() => true)
    .catch(e => e);
};

userSchema.methods.generateNick = function () {
  const user = this;
  const animals = ['goose', 'cat', 'dog', 'wolf', 'tiger', 'lion', 'leopard', 'penguin', 'dolphin', 'bear'];
  const adjectives = ['cool', 'dark', 'tall', 'short', 'lame', 'quiet', 'cute'];
  const rn = Math.floor(Math.random() * 10000);

  const name = `${pickOne(adjectives)}-${pickOne(animals)}-${rn}`;

  user.nickname = name;
  return user.save().then(() => user.nickname)
    .catch(e => e);
};

userSchema.methods.updateNick = function (nick) {
  const user = this;
  user.nickname = nick.substring(0, 32);
  return user.save().then(() => true)
    .catch(e => e);
};

// Define hooks for pre-saving
userSchema.pre('save', function (next) {
  const user = this;
  if (user.isNew) {
    this.nickname = this.generateNick();
  }
  if (user.isModified('password')) {
    this.password = this.hashPassword(this.password);
    next();
  } else {
    next();
  }
});

module.exports = mongoose.models.Users || mongoose.model('Users', userSchema);
