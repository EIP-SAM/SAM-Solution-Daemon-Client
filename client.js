const fs = require('fs');
const path = require('path');

const getUserHome = require('./services/getUserHome');
const gitService = require('./services/git');

const serverUrl = require('./config/base.config.json').serverUrl;
const userInfo = require('./config/base.config.json').userInfo;

fs.access(path.join(getUserHome() + '/.git'), fs.F_OK, function(err){
  console.log(err ? 'Repo not init yet, creating it now' : 'Repo already created');
  if (err) {
    gitService.initRepo(getUserHome()).then(function(msg) {
      main();
    });
  } else {
    main();
  }
});

function main() {
  let socket = require('socket.io-client')(serverUrl);
  console.log('Listen on server URL : ', serverUrl);

  let register = require('./modules/')(socket);
}
