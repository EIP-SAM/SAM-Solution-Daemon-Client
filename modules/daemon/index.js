const onGetUserData = require('./getUserData');

module.exports = (socket) => {
  /*
    GetUserData : Send user's data
   */
   onGetUserData(socket);
}
