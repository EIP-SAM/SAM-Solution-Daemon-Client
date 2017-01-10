const os = require('os');

const Git = require('git-wrapper');

const config = require('../config/base.config.json');

function getUserRepoUrl() {
  return `${config.serverUrl + config.gitServerRoute + config.userInfo.username}.git`;
}

function getBranchNameToSave() {
  const now = new Date().toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')
    .replace(new RegExp(':', 'g'), '-');
  return `'${os.hostname()}_${now.split(' ').join('_')}'`;
}

module.exports.initRepo = function initRepo(path) {
  return new Promise((fullfill, reject) => {
    const git = new Git({ cwd: path });
    git.exec('init', {}, []).then(() => {
      git.exec('remote', {}, ['add', 'origin', getUserRepoUrl()]).then(() => {
        git.exec('commit', {}, ['--allow-empty', '-m', 'daemon_initial_commit']).then(() => {
          git.exec('push', { u: true }, ['origin', 'master', '--force']).then(() => {
            console.log('Repo initialized');
            fullfill('ok');
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
};

module.exports.save = function save(path, files) {
  return new Promise((fullfill, reject) => {
    const git = new Git({ cwd: path });
    const addOptions = (files === '*' ? { all: true } : {});
    const addArgs = (files === '*' ? [] : files);
    const branchName = getBranchNameToSave();

    git.exec('checkout', { b: true }, [branchName]).then(() => {
      git.exec('add', addOptions, addArgs).then(() => {
        git.exec('commit', { a: true, m: true }, [branchName, '--allow-empty']).then(() => {
          git.exec('push', { u: true }, ['origin', branchName]).then(() => {
            console.log('Save : OK');
            fullfill({ files, branch: branchName });
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
};

module.exports.restore = function restore(path, branchName) {
  return new Promise((fullfill, reject) => {
    const git = new Git({ cwd: path });

    git.exec('fetch', { all: true }).then(() => {
      git.exec('reset', { hard: true }, [`origin/${branchName}`]).then(() => {
        console.log('restore : OK');
        fullfill({ branch: branchName });
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
};
