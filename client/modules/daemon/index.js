const userInfo = require('../../config/base.config.json').userInfo;

module.exports = (socket) => {
  socket.on('getDaemonInfo', function(msg){
    console.log('getDaemonInfo');
    socket.emit('getDaemonInfo', {message: userInfo});
  });
}
