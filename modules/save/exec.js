let Repository = require('git-cli').Repository

const gitUser = require('../../config/git.config.json').serverGitUser;
const repoPath = require('../../config/git.config.json').baseDir;

module.exports = (socket) => {
  /*
    exec : exec a save
   */
  socket.on('server_save_Exec', function(msg){
    console.log('server_save_Exec : ', msg.path);
    socket.emit('daemon_save_Exec', {isStart: true, isFinish: false, isSuccess: false, msg: 'OK'});
  });
}
