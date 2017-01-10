const daemon = require('./daemon');
const save = require('./save');
const restore = require('./restore');
const reboot = require('./reboot');
const software = require('./software');
const notification = require('./notification');
const migration = require('./migration');

module.exports = (socket) => {
  daemon(socket);
  save(socket);
  restore(socket);
  reboot(socket);
  software(socket);
  notification(socket);
  migration(socket);
};
