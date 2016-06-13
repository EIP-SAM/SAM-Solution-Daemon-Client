var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var register = require('./libs/register')(io);

const port = require('./config/base.config.json').port;

http.listen(port, function(){
  console.log('listening on *:' + port);
});
