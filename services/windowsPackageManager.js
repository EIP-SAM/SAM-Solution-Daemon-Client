//
// Simulate a successful software packages install
//
module.exports.install = function install(packages) {
  return new Promise((fulfill) => {
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
module.exports.update = function update(packages) {
  return new Promise((fulfill) => {
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
module.exports.remove = function remove(packages) {
  return new Promise((fulfill) => {
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
module.exports.query = function query(packageName) {
  return new Promise((fulfill) => {
    fulfill({
      status: 'success',
      request: packageName,
      result: [
        { packageName, description: `A super ${packageName} description`, installed: true },
        { packageName: `${packageName}-foo`, description: `A super ${packageName}-foo description`, installed: false },
        { packageName: `${packageName}-baz`, description: `A super ${packageName}-baz description`, installed: true },
      ],
    });
  });
};

//
// Simulate a successful list installed packages query
//
module.exports.list = function list() {
  return new Promise((fulfill) => {
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
