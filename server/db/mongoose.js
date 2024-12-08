const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

const local = 'mongodb://localhost:27017/RoleApp';
// var heroku = 'mongodb://heroku_csxrfxrp:ehc2s9nr8kruqquavm6eeb8ce8@ds247944.mlab.com:47944/heroku_csxrfxrp';

const db = process.env.MONGODB_URI || local;

mongoose.connect(db, { useNewUrlParser: true }).catch((err) => {
  // eslint-disable-next-line no-console
  console.log(err);
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
module.exports = { mongoose };
