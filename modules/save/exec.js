let Repository = require('git-cli').Repository

const gitConfig = require('../../config/git.config.json');

module.exports = (socket, base) => {
  console.log(gitConfig);
  /*
    exec : exec a save
   */
  socket.on('server_save_Exec', function(msg){
    console.log('server_save_Exec : ', msg.path);
    
    socket.emit('daemon_save_Exec', {isStart: true, isFinish: false, isSuccess: false, path: msg.path, msg: 'OK'});
  });
}
