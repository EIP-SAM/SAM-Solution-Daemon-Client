const serverUrl = require('./config/base.config.json').serverUrl;

let socket = require('socket.io-client')('http://' + serverUrl);
let register = require('./modules/')(socket);
