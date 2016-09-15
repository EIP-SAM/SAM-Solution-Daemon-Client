module.exports = (socket) => {
  const daemon = require('./daemon')(socket);
  const save = require('./save')(socket);
  const restore = require('./restore')(socket);
  const reboot = require('./reboot')(socket);
}
