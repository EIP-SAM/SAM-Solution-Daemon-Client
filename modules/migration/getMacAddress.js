const getMacAddress = require('../../services/getMacAddress');

module.exports = (socket) => {
  /*
    getMacAddress :  Return Mac Address
   */
  socket.on('server_getMacAdress_exec', function(msg){
    console.log('daemon_getMacAdress_exec :', msg);
    getMacAddress(msg.username).then((macAddress) => {
      socket.emit('daemon_getMacAdress_exec', {macAddress});
    }); 
  });
}
