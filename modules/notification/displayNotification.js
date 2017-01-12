const displayNotification = require('../../services/displayNotification');

module.exports = (socket) => {
  /*
    notificationDisplay : Display notification
   */
  socket.on('server_notification_module', (msg) => {
    console.log('server_notification_module :', msg);
    displayNotification(msg.title, msg.description);
    socket.emit('daemon_notification_module', { msg: 'ok' });
  });
};
