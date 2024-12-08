const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  location: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
    },
  },
  stories: [{
    title: {
      type: String,
      required: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
      default: 2,
    },
    type: {
      type: String,
      default: 'one-shot',
    },
    synopsis: {
      type: String,
    },
    starter: {
      type: String,
    },
    hints: [String],
  }],
});

module.exports = mongoose.models.Stories || mongoose.model('Stories', storySchema);
