const gitService = require('../../services/git');
const getUserHome = require('../../services/getUserHome');

module.exports = (socket, base) => {
  /*
    exec : exec a save
   */
  socket.on('server_save_Exec', function(msg){
    console.log('server_save_Exec : ', msg.files);
    socket.emit('daemon_save_Exec', {isStart: true, isFinish: false, isSuccess: false, files: msg.files});
    gitService.save(getUserHome(), msg.files).then(function(msg) {
      socket.emit('daemon_save_Exec', {isStart: true, isFinish: true, isSuccess: true, files: msg.files, branch: msg.branch});
    }).catch(function(err) {
      console.log(err);
      socket.emit('daemon_save_Exec', {isStart: true, isFinish: true, isSuccess: false, files: msg.files, msg: err});
    });
  });
}
