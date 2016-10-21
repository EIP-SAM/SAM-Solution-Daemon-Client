module.exports.install = function (packages) {
  return new Promise(function (fulfill, reject) {
    fulfill({ command: 'install', finished: true });
  });
};

module.exports.update = function (packages) {
  return new Promise(function (fulfill, reject) {
    fulfill({ command: 'update', finished: true });
  });
};

module.exports.remove = function (packages) {
  return new Promise(function (fulfill, reject) {
    fulfill({ command: 'remove', finished: true });
  });
};

module.exports.query = function (package) {
  return new Promise(function (fulfill, reject) {
    fulfill({ command: 'query', finished: true });
  });
};

module.exports.list = function () {
  return new Promise(function (fulfill, reject) {
    fulfill({ command: 'list', finished: true });
  });
};

module.exports.getOperatingSystem = function () {
  return new Promise(function (fulfill, reject) {
    fulfill({ command: 'get_operating_system', finished: true });
  });
};
