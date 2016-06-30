module.exports = (socket) => {
  /*
    exec : exec a restore
   */
  socket.on('server_restore_Exec', function(msg){
    console.log('server_restore_Exec : ', msg.commit);
    socket.emit('daemon_restore_Exec', {isStart: true, isFinish: false, isSuccess: false, msg: 'OK'});
  });
}
