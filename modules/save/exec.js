const gitService = require('../../services/git');
const getUserHome = require('../../services/getUserHome');

module.exports = (socket) => {
  /*
    exec : exec a save
   */
  socket.on('server_save_Exec', (msg) => {
    console.log('server_save_Exec : ', msg.files);
    socket.emit('daemon_save_Exec', { isStart: true, isFinish: false, isSuccess: false, files: msg.files });
    gitService.save(getUserHome(), msg.files).then((data) => {
      socket.emit('daemon_save_Exec', { isStart: true, isFinish: true, isSuccess: true, files: data.files, branch: data.branch });
    }).catch((err) => {
      console.log(err);
      socket.emit('daemon_save_Exec', { isStart: true, isFinish: true, isSuccess: false, files: msg.files, err: `${err}` });
    });
  });
};
