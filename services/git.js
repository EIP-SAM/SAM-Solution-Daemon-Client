let os = require('os');

const Git = require('../workers/git');

const debug = require('../config/base.config.json').debug;
const userInfo = require('../config/base.config.json').userInfo;

const gitConfig = require('../config/git.config.json');

let getUserRepoUrl = function () {
  return gitConfig.gitServerUser + '@' + gitConfig.gitServerUrl + ':' + gitConfig.gitServerDir + userInfo.username;
}

let getBranchNameToSave = function () {
  let now = new Date().toISOString().
    replace(/T/, ' ').
    replace(/\..+/, '').
    replace(new RegExp(':', 'g'), '-');
  return '\'' + os.hostname() + '_' + now.split(' ').join('_') + '\'';
}

module.exports.initRepo = function initRepo(path) {
  let git = new Git({cwd: path});
  git.exec('init', {}, []).then(function(stdout){
    git.exec('remote', {}, ['add', 'origin', getUserRepoUrl()]).then(function(stdout){
      git.exec('fetch', {}, []).then(function(stdout){
        console.log('Init : OK');
      }).catch(function(err) {
        console.log(err);
      });
    }).catch(function(err) {
      console.log(err);
    });
  }).catch(function(err) {
    console.log(err);
  });
}

module.exports.save = function initRepo(path) {
  let git = new Git({cwd: path});
  git.exec('checkout', {b: true}, [getBranchNameToSave()]).then(function(stdout) {
    git.exec('add', {all: true}).then(function(stdout) {
      git.exec('commit', {a: true, m: true}, [getBranchNameToSave()]).then(function(stdout) {

      }).catch(function(err) {
        console.log(err);
      });
    }).catch(function(err) {
      console.log(err);
    });
  }).catch(function(err) {
    console.log(err);
  });
}
