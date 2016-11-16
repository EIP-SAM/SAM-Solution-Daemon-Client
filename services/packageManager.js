const os = require('os');

if (os.type == 'Windows_NT') {
  module.exports = require('./windowsPackageManager');
} else {
  module.exports = require('./unixPackageManager');
}

module.exports.getOperatingSystem = function () {
  return new Promise(function (fulfill, reject) {
    fulfill({
      status: 'success',
      operatingSystem: os.type(),
      systemDistribution: os.release(),
      processorArchitecture: os.arch(),
    });
  });
};
