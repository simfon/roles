/* eslint-disable func-names */
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const landSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  north: {
    type: ObjectId,
  },
  south: {
    type: ObjectId,
  },
  east: {
    type: ObjectId,
  },
  west: {
    type: ObjectId,
  },
  people: [ObjectId],
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
  lastActivity: Number,
});

landSchema.methods.incoming = function (userId) {
  const land = this;
  return land.updateOne({ $push: { people: userId } });
};

landSchema.methods.outgoing = function (userId) {
  const land = this;
  return land.updateOne({ $pull: { people: userId } });
};

landSchema.pre('save', function (next) {
  const land = this;

  if (land.isModified('chat')) {
    this.lastActivity = new Date().getTime();
    next();
  } else {
    next();
  }
});

module.exports = mongoose.models.Lands || mongoose.model('Lands', landSchema);
