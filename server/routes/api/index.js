const express = require('express');

const router = express.Router();

router.use('/user', require('./user'));

router.use('/game', require('./game-api'));

router.use('/subscribe', require('./subscribe'));

router.use('/avatars', require('./avatars'));

router.use('/lands', require('./land-api'));

// router.use('/push', require('./push'));

module.exports = router;
