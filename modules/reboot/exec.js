
const reboot = require('os-reboot');

module.exports = (socket) => {
  /*
    exec : exec a restore
   */
  socket.on('server_reboot_Exec', function(msg){
    reboot();
  });
}
