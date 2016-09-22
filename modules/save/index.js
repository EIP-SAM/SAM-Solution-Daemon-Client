const onExec = require('./exec');
const getUserHome = require('../../services/getUserHome');

module.exports = (socket) => {
  /*
    exec : exec a save
   */
   onExec(socket, getUserHome());
}
