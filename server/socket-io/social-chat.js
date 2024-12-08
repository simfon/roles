const _ = require('lodash');

let chatMemory = [];

module.exports = (io, socket) => {
  socket.on('join', (params) => {
    if (params.game === 'supersocialroom' && chatMemory.length > 0) {
      socket.emit('JOIN_SOCIAL', chatMemory);
    }
  });

  socket.on('SOCIAL_MESSAGE', (params) => {
    const message = _.pick(params, ['sender', 'text']);
    message.sender = socket.request.user.nickname;
    message.text = message.text.slice(0, 5000);
    if (message.text && message.sender) {
      chatMemory.push(message);
      if (chatMemory.length > 50) {
        chatMemory = chatMemory.slice(1, 50);
      }
      io.to('supersocialroom').emit('RECEIVE_MESSAGE', message);
    }
  });
};
