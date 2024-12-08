/* eslint-disable global-require */

module.exports = (io) => {
  io.on('connection', (socket) => {
    require('./social-chat')(io, socket);
    require('./role-chat')(io, socket);

    return io;
  });
};
