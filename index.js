module.exports.setupAllSocketEvent = function setupAllSocketEvent(socket) {
  socket.emit('getDaemonInfo');
  socket.on('getDaemonInfo', (info) => {
    console.log(info.message);
  });
};
