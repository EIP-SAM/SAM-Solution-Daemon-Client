modules.exports.setupAllSocketEvent = function (socket) {
  socket.emit('getDaemonInfo');
  socket.on('getDaemonInfo', function (info) {
    console.log(info.message);
  });
}
