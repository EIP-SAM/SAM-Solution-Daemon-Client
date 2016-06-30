module.exports = (socket) => {
  const daemon = require('../modules/daemon')(socket);
  const save = require('../modules/save')(socket);
  const restore = require('../modules/restore')(socket);
}
