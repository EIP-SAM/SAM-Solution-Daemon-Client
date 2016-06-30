module.exports = (socket) => {
  /*
    exec : exec a save
   */
  socket.on('server_save_Exec', function(msg){
    console.log('server_save_Exec : ', msg.path);
    socket.emit('daemon_save_Exec', {isStart: true, isFinish: false, isSuccess: false, msg: 'OK'});
  });
}
