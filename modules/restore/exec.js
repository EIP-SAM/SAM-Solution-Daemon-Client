const gitService = require('../../services/git');
const getUserHome = require('../../services/getUserHome');

module.exports = (socket) => {
  /*
    exec : exec a restore
   */
  socket.on('server_restore_Exec', (msg) => {
    console.log('server_restore_Exec : ', msg.branch);
    socket.emit('daemon_restore_Exec', { isStart: true, isFinish: false, isSuccess: false, branch: msg.branch, msg: 'OK' });
    gitService.restore(getUserHome(), msg.branch).then((msgRestore) => {
      socket.emit('daemon_restore_Exec', { isStart: true, isFinish: true, isSuccess: true, branch: msg.branch, msgRestore });
    }).catch((err) => {
      console.log(err);
      socket.emit('daemon_restore_Exec', { isStart: true, isFinish: true, isSuccess: false, branch: msg.branch, msg: err });
    });
  });
};
