const port = require('./config/base.config.json').port;
const serverUrl = require('./config/base.config.json').serverUrl;

let socket = require('socket.io-client')(serverUrl);
let register = require('./libs/register')(socket);
