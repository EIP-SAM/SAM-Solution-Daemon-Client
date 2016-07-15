const Repository = require('git-cli').Repository

const serverUrl = require('./config/base.config.json').serverUrl;
const userInfo = require('./config/base.config.json').userInfo;

let socket = require('socket.io-client')(serverUrl);
console.log('Listen on server URL : ', serverUrl);
let register = require('./modules/')(socket);
