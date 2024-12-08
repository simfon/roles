require('./config/config');

const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const passportSocketIo = require('passport.socketio');
const socketIO = require('socket.io');
const webpush = require('web-push');
const { mongoose } = require('./db/mongoose');
const Users = require('./models/users');

// Passport configuration
require('./passport');
require('./models/users');

// Database Seeds
require('./seed/stories');
require('./seed/lands');

// Settings
const isProduction = process.env.NODE_ENV === 'production';
const publicPath = path.join(__dirname, '../build');
const port = process.env.PORT || 3000;
const secret = process.env.SESSION_SECRET || '234J1934%JFAJ93';

webpush.setVapidDetails('mailto:info@roles.pw', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(publicPath));
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
const sessionConfig = session({
  secret,
  store: sessionStore,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  resave: false,
  saveUninitialized: false,
});
app.use(sessionConfig);

// email verification, move this to  Router you lazy bastard
app.get('/verify/:id', (req, res) => {
  Users.findOneAndUpdate({
    randomstring: req.params.id,
    active: false,
  }, { $set: { active: true } }).then((user) => {
    if (user) {
      return res.status(301).redirect('http://www.roles.pw');
    }
    return res.status(404).send();
  })
    .catch(e => res.status(404).send(e));
});

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes'));

const server = http.createServer(app);
const io = socketIO(server);
if (!isProduction) {
  io.set('origins', '*:*');
}

// IO Auth middleware
const onAuthorizeSuccess = (data, accept) => {
  accept();
};

const onAuthorizeFail = (data, message, error, accept) => {
  if (error) {
    accept(new Error(message));
  }
  accept(new Error('Unauthorized user'));
};

io.use(passportSocketIo.authorize({
  cookieParser,
  key: 'connect.sid',
  secret,
  store: sessionStore,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail,
}));

require('./socket-io')(io, session);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is up on port ${port}`);
});

module.exports = { app };
