const getMacAddress = require('getmac');

module.exports = function getMacAddressFct() {
  return new Promise((fullfill, reject) => {
    getMacAddress.getMac((err, macAddress) => {
      if (err) {
        reject(err);
      }
      fullfill(macAddress);
    });
  });
};
