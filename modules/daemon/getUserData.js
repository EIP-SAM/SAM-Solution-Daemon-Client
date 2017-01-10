const userInfo = require('../../config/base.config.json').userInfo;

module.exports = (socket) => {
  /*
    GetUserData : Send user's data
   */
  socket.on('server_GetUserData', () => {
    console.log('server_GetUserData');
    socket.emit('daemon_GetUserData', userInfo);
  });
};
