//Credit to https://github.com/pvorb/node-git-wrapper, for the base of this code.
// imports
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

const debug = require('../config/base.config.json').debug;

// Class Git
var Git = module.exports = function (options) {
  this.binary = 'git';
  if (typeof options == 'undefined')
    options = {};

  this.cwd = options.cwd || process.cwd();
  delete options.cwd;

  this.args = Git.optionsToString(options);
};

// git.exec(command [[, options], args ], callback)
Git.prototype.exec = function (command, options, args, callback) {
  if (typeof options === 'undefined' || options == {}) {
    options = '';
  } else {
    options = Git.optionsToString(options)
  }

  if (typeof args === 'undefined' || args  == []) {
    args = '';
  } else {
    args = args.join(' ');
  }

  if (typeof callback === 'undefined') {
    callback = function (err, stdout) {};
  }

  var cmd = this.binary + ' ' + this.args + ' ' + command + ' ' + options + ' '
    + args;

  if (debug) {
    console.log('GIT-CMD : ', cmd);
  }

  var cwd = this.cwd;

  return new Promise(function(fullfill, reject) {
    exec(cmd, {
      cwd: cwd
    }, function (err, stdout, stderr) {
      callback(err, stdout);
      if (err) {
        reject(err);
      } else {
        fullfill(stdout);
      }
    });
  })
};

// converts an object that contains key value pairs to a argv string
Git.optionsToString = function (options) {
  var args = [];

  for (var k in options) {
    var val = options[k];

    if (k.length == 1) {
      // val is true, add '-k'
      if (val === true)
        args.push('-'+k);
      // if val is not false, add '-k val'
      else if (val !== false)
        args.push('-'+k+' '+val);
    } else {
      if (val === true)
        args.push('--'+k);
      else if (val !== false)
        args.push('--'+k+'='+val);
    }
  }

  return args.join(' ');
};
