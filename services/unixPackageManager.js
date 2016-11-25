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

function parsePacmanQuery(package, output, returnObj, fulfill) {
  var stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type == 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split('\n');

  var packageData = {};
  stdout.forEach((line) => {
    if (line !== '') {
      if (line[0] !== ' ') {
        packageData = {};
        packageData.repository = line.split('/')[0];
        packageData.packageName = line.split('/')[1].split(' ')[0];
        packageData.version = line.split('/')[1].split(' ')[1];
        packageData.installed = line.split('[')[1] ? true : false;
      } else {
        packageData.description = line.substr(4);
        returnObj.result.push(packageData);
      }
    }
  });

  returnObj.result.forEach((package) => {
    console.log('name:', package.packageName);
    console.log('installed:', package.installed);
    console.log('version:', package.version);
    console.log('description:', package.description);
    console.log('repository:', package.repository);
    console.log();
  });

  fulfill(returnObj);
}

function parseDpkgQuery(package, output, returnObj, fulfill) {
  var stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type == 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split('\n');

  stdout.forEach((line) => {
    if (line !== '') {
      const packageData = {};

      packageData.packageName = line.split(' ')[0];
      packageData.description = line.substr(packageData.name.length + 3);
      packageData.installed = false;
      returnObj.result.push(packageData);

      console.log('name:', packageData.packageName);
      console.log('description:', packageData.description);
      console.log('description:', packageData.installed);
      console.log();
    }
  });

  fulfill(returnObj);
}

const queriesParser = {
  pacman: parsePacmanQuery,
  dpkg: parseDpkgQuery,
};

function query(package, returnObj, fulfill) {
  if (queriesParser[pacapt.localInfos.packageManager] !== undefined) {
    pacapt.Ss([package]).then((output) => {
      queriesParser[pacapt.localInfos.packageManager](package, output, returnObj, fulfill);
    }).catch((output) => {
      returnObj.status = 'failure';
      returnObj.error = output.error;
      returnObj.output = output;
      fulfill(returnObj);
    });
  } else {
    returnObj.status = 'failure';
    returnObj.error = `Package manager ${pacapt.localInfos.packageManager} is not supported (yet) for package queries`;
    fulfill(returnObj);
  }
}

//
// Simulate of successful package query
// -> query a list of available packages from a string
//
module.exports.query = function (package) {
  return new Promise(function (fulfill, reject) {
    const returnObj = {
      status: 'success',
      request: package,
      result: [],
    };

    if (pacapt.localInfos.packageManager === 'undefined') {
      pacapt.init().then(() => {
        query(package, returnObj, fulfill);
      }).catch((error) => {
        returnObj.status = 'failure';
        returnObj.error = `error during pacapt initialization: ${error}`;
        fulfill(returnObj);
      });
    } else {
      query(package, returnObj, fulfill);
    }
  });
};

function parsePacmanList(output, returnObj, fulfill) {
  var stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type == 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split('\n');

  stdout.forEach((line) => {
    if (line !== '') {
      const packageData = {};

      packageData.packageName = line.split(' ')[0];
      packageData.version = line.split(' ')[1];
      packageData.installed = true;
      packageData.description = 'not available';
      returnObj.result.push(packageData);
    }
  });

  fulfill(returnObj);
}

function parseDpkgList(output, returnObj, fulfill) {
  var stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type == 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split('\n');

  stdout.forEach((line) => {
    if (line !== '') {
      const packageData = {};

      packageData.packageName = line.substr(4).split(' ')[0];

      packageData.version = line.substr(line.indexOf(packageData.packageName) + packageData.packageName.length);
      while (packageData.version.indexOf(' ') === 0) {
        packageData.version = packageData.version.substr(1);
      }
      packageData.version = packageData.version.substr(0, packageData.version.indexOf(' '));

      packageData.architecture = line.substr(line.indexOf(packageData.version) + packageData.version.length);
      while (packageData.architecture.indexOf(' ') === 0) {
        packageData.architecture = packageData.architecture.substr(1);
      }
      packageData.architecture = packageData.architecture.substr(0, packageData.architecture.indexOf(' '));

      packageData.description = line.substr(line.indexOf(packageData.architecture) + packageData.architecture.length);
      while (packageData.description.indexOf(' ') === 0) {
        packageData.description = packageData.description.substr(1);
      }

      packageData.installed = true;
      returnObj.result.push(packageData);
    }
  });

  fulfill(returnObj);
}

const listParser = {
  pacman: parsePacmanList,
  dpkg: parseDpkgList,
};

function list(returnObj, fulfill) {
  if (listParser[pacapt.localInfos.packageManager] !== undefined) {
    pacapt.Q().then((output) => {
      listParser[pacapt.localInfos.packageManager](output, returnObj, fulfill);
    }).catch((output) => {
      returnObj.status = 'failure';
      returnObj.error = output.error;
      returnObj.output = output;
      fulfill(returnObj);
    });
  } else {
    returnObj.status = 'failure';
    returnObj.error = `Package manager ${pacapt.localInfos.packageManager} is not supported (yet) for package listing`;
    fulfill(returnObj);
  }
}

//
// Simulate a successful list installed packages query
// -> query a list of all installed packages
//
module.exports.list = function () {
  return new Promise(function (fulfill, reject) {
    const returnObj = {
      status: 'success',
      result: [],
    };

    if (pacapt.localInfos.packageManager === 'undefined') {
      pacapt.init().then(() => {
        list(returnObj, fulfill);
      }).catch((error) => {
        returnObj.status = 'failure';
        returnObj.error = `error during pacapt initialization: ${error}`;
        fulfill(returnObj);
      });
    } else {
      list(returnObj, fulfill);
    }
  });
};
