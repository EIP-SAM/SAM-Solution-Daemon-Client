const getMacAddress = require('getmac');

module.exports = function getMacAddressFct(title, message) {
    return new Promise((fullfill, reject) => {
        getMacAddress.getMac(function(err, macAddress){
            if (err)  {
                reject(err);
            }
            fullfill(macAddress)
        })
    });
}
