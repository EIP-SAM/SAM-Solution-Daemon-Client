let os = require('os');

const Git = require('git-wrapper');

const debug = require('../config/base.config.json').debug;
const userInfo = require('../config/base.config.json').userInfo;

const config = require('../config/base.config.json');

let getUserRepoUrl = function () {
  return config.serverUrl + config.gitServerRoute + config.userInfo.username + '.git';
};

let getBranchNameToSave = function () {
  let now = new Date().toISOString().
    replace(/T/, ' ').
    replace(/\..+/, '').
    replace(new RegExp(':', 'g'), '-');
  return '\'' + os.hostname() + '_' + now.split(' ').join('_') + '\'';
};

module.exports.initRepo = function initRepo(path) {
  return new Promise(function(fullfill, reject) {
    let git = new Git({cwd: path});
    git.exec('init', {}, []).then(function(stdout){
      git.exec('remote', {}, ['add', 'origin', getUserRepoUrl()]).then(function(stdout){
        git.exec('commit', {}, ['--allow-empty', '-m', 'daemon_initial_commit']).then(function(stdout){
          git.exec('push', {u: true}, ['origin', 'master', '--force']).then(function(stdout){
            console.log('Repo initialized');
            fullfill('ok');
          }).catch(function(err) {
            console.log(err);
            reject(err);
          });
        }).catch(function(err) {
          console.log(err);
          reject(err);
        });
      }).catch(function(err) {
        console.log(err);
        reject(err);
      });
    }).catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
};

module.exports.save = function save(path, files) {
  return new Promise(function(fullfill, reject) {
    let git = new Git({cwd: path});
    let addOptions = (files == '*' ? {all: true} : {});
    let addArgs = (files == '*' ? [] : files);
    let branchName = getBranchNameToSave();

    git.exec('checkout', {b: true}, [branchName]).then(function(stdout) {
      git.exec('add', addOptions, addArgs).then(function(stdout) {
        git.exec('commit', {a: true, m: true}, [branchName, '--allow-empty']).then(function(stdout) {
          git.exec('push', {u: true}, ['origin', branchName]).then(function(stdout) {
            console.log('Save : OK');
            fullfill({files: files, branch: branchName});
          }).catch(function(err) {
            reject(err);
          });
        }).catch(function(err) {
          console.log(err);
          reject(err);
        });
      }).catch(function(err) {
        console.log(err);
        reject(err);
      });
    }).catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
};

module.exports.restore = function restore(path, branchName) {
  return new Promise(function(fullfill, reject) {
    let git = new Git({cwd: path});

    git.exec('fetch', {all: true}).then(function(stdout) {
      git.exec('reset', {hard: true}, ['origin/' + branchName]).then(function(stdout) {
        console.log('restore : OK');
        fullfill({branch: branchName});
      }).catch(function(err) {
        reject(err);
      });
    }).catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
};
