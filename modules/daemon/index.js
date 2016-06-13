module.exports = (io) => {

  io.on('connection', function(socket){
    console.log('server connected');
  });

  io.on('check', function(msg){
    console.log('check : ' + msg);
  });
}
