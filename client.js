const fs = require('fs');
const path = require('path');
const socket = require('socket.io-client');

const getUserHome = require('./services/getUserHome');
const gitService = require('./services/git');
const register = require('./modules/');

const serverUrl = require('./config/base.config.json').serverUrl;

function main() {
  const socketObj = socket(serverUrl);
  console.log('Listen on server URL : ', serverUrl);

  register(socketObj);
}

fs.access(path.join(`${getUserHome()}/.git`), fs.F_OK, (err) => {
  console.log(err ? 'Repo not init yet, creating it now' : 'Repo already created');
  if (err) {
    gitService.initRepo(getUserHome());
  }
  main();
});

