const pacapt = require('node-pacapt');
const semaphore = require('semaphore')(1);

function install(packages, i, returnObj, fulfill, semaphore) {
  const package = packages[i];

  console.log('package', package);
  pacapt.install([package]).then((output) => {
    returnObj.result.push({ packageName: package, installed: true });
    console.log(output);
    if (returnObj.result.length == packages.length) {
      semaphore.leave();
      fulfill(returnObj);
    } else {
      install(packages, i + 1, returnObj, fulfill);
    }
  })
  .catch((output) => {
    returnObj.result.push({ packageName: package, installed: false, error: output.error });
    console.log(output);
    if (returnObj.result.length == packages.length) {
      semaphore.leave();
      fulfill(returnObj);
    }
  });
}

module.exports.install = function (packages) {
  return new Promise(function (fulfill, reject) {
    const returnObj = {
      status: 'success',
      request: packages,
      result: [],
    };

    semaphore.take(() => {
      install(packages, 0, returnObj, fulfill, semaphore);
    });
  });
};

function update(packages, i, returnObj, fulfill, semaphore) {
  const package = packages[i];

  console.log('package', package);
  pacapt.update([package]).then((output) => {
    returnObj.result.push({ packageName: package, updated: true });
    console.log(output);
    if (returnObj.result.length == packages.length) {
      semaphore.leave();
      fulfill(returnObj);
    } else {
      update(packages, i + 1, returnObj, fulfill);
    }
  })
  .catch((output) => {
    returnObj.result.push({ packageName: package, updated: false, error: output.error });
    console.log(output);
    if (returnObj.result.length == packages.length) {
      semaphore.leave();
      fulfill(returnObj);
    }
  });
}

module.exports.update = function (packages) {
  return new Promise(function (fulfill, reject) {
    const returnObj = {
      status: 'success',
      request: packages,
      result: [],
    };

    semaphore.take(() => {
      pacapt.updateDatabase().then((output) => {
        update(packages, 0, returnObj, fulfill, semaphore);
      })
      .catch((output) => {
        returnObj.status = 'failure';
        returnObj.error = output.error;
        semaphore.leave();
        fulfill(returnObj);
      });
    });
  });
};

function remove(packages, i, returnObj, fulfill, semaphore) {
  const package = packages[i];

  console.log('package', package);
  pacapt.remove([package]).then((output) => {
    returnObj.result.push({ packageName: package, removed: true });
    console.log(output);
    if (returnObj.result.length == packages.length) {
      semaphore.leave();
      fulfill(returnObj);
    } else {
      remove(packages, i + 1, returnObj, fulfill);
    }
  })
  .catch((output) => {
    returnObj.result.push({ packageName: package, removed: false, error: output.error });
    console.log(output);
    if (returnObj.result.length == packages.length) {
      semaphore.leave();
      fulfill(returnObj);
    }
  });
}

module.exports.remove = function (packages) {
  return new Promise(function (fulfill, reject) {
    const returnObj = {
      status: 'success',
      request: packages,
      result: [],
    };

    semaphore.take(() => {
      remove(packages, 0, returnObj, fulfill, semaphore);
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
        { packageName: 'cmake', description: 'A super `cmake` description', installed: true },
        { packageName: 'git', description: 'A super `git` description', installed: true },
        { packageName: 'git-baz', description: 'A super `git-baz` description', installed: true },
        { packageName: 'foo', description: 'A super `foo` description', installed: true },
        { packageName: 'bar', description: 'A super `bar` description', installed: true },
        { packageName: 'baz', description: 'A super `baz` description', installed: true },
      ],
    });
  });
};
