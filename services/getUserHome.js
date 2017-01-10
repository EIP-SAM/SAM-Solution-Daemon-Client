module.exports = function getUserHome() {
  // return './testRepo';
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
};
