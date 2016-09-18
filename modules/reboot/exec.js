
const reboot = require('os-reboot');

module.exports = (socket) => {
  /*
    exec : exec a restore
   */
  socket.on('server_reboot_Exec', function(msg){
    socket.emit('daemon_reboot_Exec');
    reboot();
  });
}
