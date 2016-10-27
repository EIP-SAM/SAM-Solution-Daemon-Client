const notifier = require('node-notifier');

module.exports = function displayNotification(title, message) {
  notifier.notify({
    title: title,
    message: message,
  }, function (err, response) {
    // Response is response from notification
  });

  notifier.on('click', function (notifierObject, options) {
    // Triggers if `wait: true` and user clicks notification
  });

  notifier.on('timeout', function (notifierObject, options) {
    // Triggers if `wait: true` and notification closes
  });
}
