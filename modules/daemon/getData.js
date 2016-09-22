const userInfo = require('../../config/base.config.json').userInfo;

module.exports = (socket) => {
  /*
    getData : Send user's data
   */
  socket.on('server_GetData', function(msg){
    console.log('server_GetData');
    socket.emit('daemon_GetData', userInfo);
  });
}
