const pacapt = require('node-pacapt');
const semaphore = require('semaphore')(1);
const os = require('os');

function execNextPackageInstrOrStop(packageInstr, packages, i, returnObj, fulfill) {
  if (returnObj.result.length === packages.length) {
    semaphore.leave();
    fulfill(returnObj);
  } else {
    packageInstr(packages, i + 1, returnObj, fulfill);
  }
}

function install(packages, i, returnObj, fulfill) {
  const packageName = packages[i];

  console.log('package', packageName);
  pacapt.install([packageName]).then((output) => {
    returnObj.result.push({ packageName, installed: true });
    console.log(output);
    execNextPackageInstrOrStop(install, packages, i, returnObj, fulfill);
  })
  .catch((output) => {
    returnObj.result.push({ packageName, installed: false, error: output.error });
    console.log(output);
    execNextPackageInstrOrStop(install, packages, i, returnObj, fulfill);
  });
}

module.exports.install = packages => new Promise((fulfill) => {
  const returnObj = {
    status: 'success',
    request: packages,
    result: [],
  };

  semaphore.take(() => {
    install(packages, 0, returnObj, fulfill);
  });
});

function update(packages, i, returnObj, fulfill) {
  const packageName = packages[i];

  console.log('package', packageName);
  pacapt.update([packageName]).then((output) => {
    returnObj.result.push({ packageName, updated: true });
    console.log(output);
    execNextPackageInstrOrStop(update, packages, i, returnObj, fulfill);
  })
  .catch((output) => {
    returnObj.result.push({ packageName, updated: false, error: output.error });
    console.log(output);
    execNextPackageInstrOrStop(update, packages, i, returnObj, fulfill);
  });
}

function executeOperationIfImplemented(operation, args) {
  return new Promise((fulfill, reject) => {
    if (pacapt.localInfos.availableOperations[operation]) {
      pacapt[operation](args).then((output) => {
        fulfill(output);
      }).catch((output) => {
        reject(output);
      });
    } else {
      fulfill(`Operation ' ${operation}' not implemented`);
    }
  });
}

function updateDatabaseIfImplemented() {
  return executeOperationIfImplemented('Sy', []);
}

function callUpdate(packages, returnObj, fulfill) {
  semaphore.take(() => {
    updateDatabaseIfImplemented().then(() => {
      update(packages, 0, returnObj, fulfill);
    }).catch((output) => {
      returnObj.status = 'failure';
      returnObj.error = output.error;
      semaphore.leave();
      fulfill(returnObj);
    });
  });
}

module.exports.update = packages => new Promise((fulfill) => {
  const returnObj = {
    status: 'success',
    request: packages,
    result: [],
  };

  if (pacapt.localInfos.packageManager === undefined) {
    pacapt.init().then(() => {
      callUpdate(packages, returnObj, fulfill);
    }).catch((error) => {
      returnObj.status = 'failure';
      returnObj.error = `error during pacapt initialization: ${error}`;
      fulfill(returnObj);
    });
  } else {
    callUpdate(packages, returnObj, fulfill);
  }
});

function remove(packages, i, returnObj, fulfill) {
  const packageName = packages[i];

  console.log('package', packageName);
  pacapt.remove([packageName]).then((output) => {
    returnObj.result.push({ packageName, removed: true });
    console.log(output);
    execNextPackageInstrOrStop(remove, packages, i, returnObj, fulfill);
  })
  .catch((output) => {
    returnObj.result.push({ packageName, removed: false, error: output.error });
    console.log(output);
    execNextPackageInstrOrStop(remove, packages, i, returnObj, fulfill);
  });
}

module.exports.remove = packages => new Promise((fulfill) => {
  const returnObj = {
    status: 'success',
    request: packages,
    result: [],
  };

  semaphore.take(() => {
    remove(packages, 0, returnObj, fulfill);
  });
});

function parsePacmanQuery(packageName, output, returnObj, fulfill) {
  let stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type === 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split('\n');

  let packageData = {};
  stdout.forEach((line) => {
    if (line !== '') {
      if (line[0] !== ' ') {
        packageData = {};
        packageData.repository = line.split('/')[0];
        packageData.packageName = line.split('/')[1].split(' ')[0];
        packageData.version = line.split('/')[1].split(' ')[1];
        packageData.installed = !!line.split('[')[1];
      } else {
        packageData.description = line.substr(4);
        returnObj.result.push(packageData);
      }
    }
  });

  semaphore.leave();
  fulfill(returnObj);
}

function parseDpkgQuery(packageName, output, returnObj, fulfill) {
  let stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type === 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split('\n');

  stdout.forEach((line) => {
    if (line !== '') {
      const packageData = {};

      packageData.packageName = line.split(' ')[0];
      packageData.description = line.substr(packageData.packageName.length + 3);
      packageData.installed = false;
      returnObj.result.push(packageData);
    }
  });

  semaphore.leave();
  fulfill(returnObj);
}

function parseChocolateyQuery(packageName, output, returnObj, fulfill) {
  let stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type === 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split(os.EOL);

  stdout.splice(0, 1); // remove first line
  stdout.splice(stdout.length - 2, 2); // remove last two lines

  stdout.forEach((line) => {
    const packageData = {};

    packageData.packageName = line.split(' ')[0];
    packageData.version = line.split(' ')[1];
    packageData.description = 'not available';
    packageData.installed = undefined;
    returnObj.result.push(packageData);
  });

  semaphore.leave();
  fulfill(returnObj);
}

const queriesParser = {
  pacman: parsePacmanQuery,
  dpkg: parseDpkgQuery,
  chocolatey: parseChocolateyQuery,
};

function query(packageName, returnObj, fulfill) {
  if (queriesParser[pacapt.localInfos.packageManager] !== undefined) {
    pacapt.Ss([packageName]).then((output) => {
      queriesParser[pacapt.localInfos.packageManager](packageName, output, returnObj, fulfill);
    }).catch((output) => {
      returnObj.status = 'failure';
      returnObj.error = output.error;
      returnObj.output = output;
      semaphore.leave();
      fulfill(returnObj);
    });
  } else {
    returnObj.status = 'failure';
    returnObj.error = `Package manager ${pacapt.localInfos.packageManager} is not supported (yet) for package queries`;
    semaphore.leave();
    fulfill(returnObj);
  }
}

module.exports.query = packageName => new Promise((fulfill) => {
  const returnObj = {
    status: 'success',
    request: packageName,
    result: [],
  };

  if (pacapt.localInfos.packageManager === undefined) {
    pacapt.init().then(() => {
      semaphore.take(() => {
        query(packageName, returnObj, fulfill);
      });
    }).catch((error) => {
      returnObj.status = 'failure';
      returnObj.error = `error during pacapt initialization: ${error}`;
      fulfill(returnObj);
    });
  } else {
    semaphore.take(() => {
      query(packageName, returnObj, fulfill);
    });
  }
});

function parsePacmanQueryPackagesInfo(output, returnObj) {
  let stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type === 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split(os.EOL);

  for (let i = 0; i !== stdout.length; i += 1) {
    const line = stdout[i];
    if (line.split(' ')[0] === 'Name') {
      for (let j = 0; j !== returnObj.result.length; j += 1) {
        const packageData = returnObj.result[j];
        if (packageData.packageName === line.split(':')[1].substr(1)) {
          let descriptionLine = stdout[i];
          while (descriptionLine.split(' ')[0] !== 'Description' && descriptionLine.split(' ')[0] !== '') {
            i += 1;
            descriptionLine = stdout[i];
          }
          if (descriptionLine.split(' ')[0] === 'Description') {
            packageData.description = descriptionLine.split(':')[1].substr(1);
          }
          break;
        }
      }
    }
  }
}

function parsePacmanList(output, returnObj, fulfill) {
  let stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type === 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split(os.EOL);

  stdout.forEach((line) => {
    if (line !== '') {
      const packageData = {};

      packageData.packageName = line.split(' ')[0];
      packageData.version = line.split(' ')[1];
      packageData.installed = true;
      packageData.description = 'Not available';
      returnObj.result.push(packageData);
    }
  });

  const listedPackages = [];
  returnObj.result.forEach((packageData) => {
    listedPackages.push(packageData.packageName);
  });

  pacapt.Si(listedPackages).then((output_) => {
    parsePacmanQueryPackagesInfo(output_, returnObj);
    semaphore.leave();
    fulfill(returnObj);
  }).catch((output_) => {
    parsePacmanQueryPackagesInfo(output_, returnObj);
    semaphore.leave();
    fulfill(returnObj);
  });
}

function parseDpkgList(output, returnObj, fulfill) {
  let stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type === 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split(os.EOL);

  stdout.forEach((line) => {
    if (line !== '') {
      const packageData = {};
      let lastIndex = 0;

      packageData.packageName = line.substr(4).split(' ')[0];
      lastIndex = 4 + packageData.packageName.length;

      packageData.version = line.substr(lastIndex);
      while (packageData.version.indexOf(' ') === 0) {
        packageData.version = packageData.version.substr(1);
        lastIndex += 1;
      }
      packageData.version = packageData.version.substr(0, packageData.version.indexOf(' '));
      lastIndex += packageData.version.length;

      packageData.architecture = line.substr(lastIndex);
      while (packageData.architecture.indexOf(' ') === 0) {
        packageData.architecture = packageData.architecture.substr(1);
        lastIndex += 1;
      }
      packageData.architecture = packageData.architecture.substr(0, packageData.architecture.indexOf(' '));
      lastIndex += packageData.architecture.length;

      packageData.description = line.substr(lastIndex);
      while (packageData.description.indexOf(' ') === 0) {
        packageData.description = packageData.description.substr(1);
        lastIndex += 1;
      }

      packageData.installed = true;
      returnObj.result.push(packageData);
    }
  });

  semaphore.leave();
  fulfill(returnObj);
}

function parseChocolateyList(output, returnObj, fulfill) {
  let stdout = '';
  output.text.forEach((outputObject) => {
    if (outputObject.type === 'stdout') {
      stdout += outputObject.data;
    }
  });
  stdout = stdout.split(os.EOL);

  stdout.splice(0, 1); // remove first line
  stdout.splice(stdout.length - 2, 2); // remove last two lines

  stdout.forEach((line) => {
    const packageData = {};

    packageData.packageName = line.split(' ')[0];
    packageData.version = line.split(' ')[1];
    packageData.installed = true;
    packageData.description = 'not available';
    returnObj.result.push(packageData);
  });

  semaphore.leave();
  fulfill(returnObj);
}

const listParser = {
  pacman: parsePacmanList,
  dpkg: parseDpkgList,
  chocolatey: parseChocolateyList,
};

function list(returnObj, fulfill) {
  if (listParser[pacapt.localInfos.packageManager] !== undefined) {
    pacapt.Q().then((output) => {
      listParser[pacapt.localInfos.packageManager](output, returnObj, fulfill);
    }).catch((output) => {
      returnObj.status = 'failure';
      returnObj.error = output.error;
      returnObj.output = output;
      semaphore.leave();
      fulfill(returnObj);
    });
  } else {
    returnObj.status = 'failure';
    returnObj.error = `Package manager ${pacapt.localInfos.packageManager} is not supported (yet) for package listing`;
    semaphore.leave();
    fulfill(returnObj);
  }
}

module.exports.list = () => new Promise((fulfill) => {
  const returnObj = {
    status: 'success',
    result: [],
  };

  if (pacapt.localInfos.packageManager === undefined) {
    pacapt.init().then(() => {
      semaphore.take(() => {
        list(returnObj, fulfill);
      });
    }).catch((error) => {
      returnObj.status = 'failure';
      returnObj.error = `error during pacapt initialization: ${error}`;
      fulfill(returnObj);
    });
  } else {
    semaphore.take(() => {
      list(returnObj, fulfill);
    });
  }
});

module.exports.getOperatingSystem = () => new Promise((fulfill) => {
  fulfill({
    status: 'success',
    operatingSystem: os.type(),
    systemDistribution: os.release(),
    processorArchitecture: os.arch(),
  });
});
