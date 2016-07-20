const fs = require('fs');

const getUserHome = require('./services/getUserHome');
const gitService = require('./services/git');

const serverUrl = require('./config/base.config.json').serverUrl;
const userInfo = require('./config/base.config.json').userInfo;

fs.access(getUserHome() + '/.git', fs.F_OK, function(err){
  console.log(err ? 'Repo not init yet, creating it now' : 'Repo already created');
  if (err) {
    gitService.initRepo(getUserHome());
    gitService.save(getUserHome());
  }
});

let socket = require('socket.io-client')(serverUrl);
console.log('Listen on server URL : ', serverUrl);

let register = require('./modules/')(socket);
