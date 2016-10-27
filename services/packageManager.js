//
// Simulate a successful software packages install
//
module.exports.install = function (packages) {
  return new Promise(function (fulfill, reject) {
    fulfill({
      status: 'success',
      request: packages,
      result: [
        { packageName: 'foo', installed: true },
        { packageName: 'bar', installed: false, error: 'Package not found' },
        { packageName: 'baz', installed: false, error: 'Dependency error, needs `toto` package, which is not available' },
      ],
    });
  });
};

//
// Simulate a successful software packages update
//
module.exports.update = function (packages) {
  return new Promise(function (fulfill, reject) {
    fulfill({
      status: 'success',
      request: packages,
      result: [
        { packageName: 'foo', updated: true },
        { packageName: 'bar', updated: false, error: 'Package is already at the higher version available' },
        { packageName: 'baz', updated: false, error: 'Dependency error, needs `toto` >= v1.5, found `toto` = v1.3' },
      ],
    });
  });
};

//
// Simulate a fatal error during software packages remove
//
module.exports.remove = function (packages) {
  return new Promise(function (fulfill, reject) {
    fulfill({
      status: 'failure',
      request: packages,
      result: [],
      error: 'Cannot find `pacapt` script on target machine',
    });
  });
};

//
// Simulate of successful package query
//
module.exports.query = function (package) {
  return new Promise(function (fulfill, reject) {
    fulfill({
      status: 'success',
      request: package,
      result: [
        { packageName: package, description: 'A super `' + package + '` description', installed: true },
        { packageName: package + '-foo', description: 'A super `' + package + '-foo` description', installed: false },
        { packageName: package + '-baz', description: 'A super `' + package + '-baz` description', installed: true },
      ],
    });
  });
};

//
// Simulate a successful list installed packages query
//
module.exports.list = function () {
  return new Promise(function (fulfill, reject) {
    fulfill({
      status: 'success',
      result: [
        { packageName: 'git', description: 'A super `git` description', installed: true },
        { packageName: 'git-baz', description: 'A super `git-baz` description', installed: true },
        { packageName: 'foo', description: 'A super `foo` description', installed: true },
        { packageName: 'bar', description: 'A super `bar` description', installed: true },
        { packageName: 'baz', description: 'A super `baz` description', installed: true },
      ],
    });
  });
};

//
// Simulate a successful get operating system query
//
module.exports.getOperatingSystem = function () {
  return new Promise(function (fulfill, reject) {
    fulfill({
      status: 'success',
      operatingSystem: 'Windaube',
      systemDistribution: '95',
      kernelVersion: '-42.0.0.1',
      processorArchitecture: 'i386',
    });
  });
};
