/* eslint no-unused-vars: "off" */
const notifier = require('node-notifier');

module.exports = function displayNotification(title, message) {
  notifier.notify({
    title,
    message,
  }, (err, response) => {
    // Response is response from notification
  });

  notifier.on('click', (notifierObject, options) => {
    // Triggers if `wait: true` and user clicks notification
  });

  notifier.on('timeout', (notifierObject, options) => {
    // Triggers if `wait: true` and notification closes
  });
};
