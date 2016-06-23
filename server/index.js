module.exports.getDaemonInfo = function (socket) {
  socket.emit('getDaemonInfo');
  socket.on('getDaemonInfo', function (info) {
    console.log(info.message);
  });
}


module.exports.initSocketEvent = function (socket) {
  
}
