const packageManager = require('../../services/packageManager');

const commands = {};
commands.install_packages = packageManager.install;
commands.update_packages = packageManager.update;
commands.remove_packages = packageManager.remove;
commands.query_package = packageManager.query;
commands.list_installed_packages = packageManager.list;
commands.get_operating_system = packageManager.getOperatingSystem;

function onSocketEvent(socket, method) {
  const fullMethodName = 'daemon_software_' + method;
  socket.on(fullMethodName, function (params, commandIndex) {
    console.log(method, params, commandIndex);
    socket.emit(fullMethodName + '_status', { started: true, method: method, params: params });
    commands[method](params).then(function (returnStatus) {
      socket.emit(fullMethodName + '_finished_' + commandIndex, returnStatus);
    }).catch(function (error) {
      socket.emit(fullMethodName + '_finished_' + commandIndex, { error });
    });
  });
}

//
//  Declare software module events/routes
//
module.exports = (socket) => {
  onSocketEvent(socket, 'install_packages');
  onSocketEvent(socket, 'update_packages');
  onSocketEvent(socket, 'remove_packages');
  onSocketEvent(socket, 'query_package');
  onSocketEvent(socket, 'list_installed_packages');
  onSocketEvent(socket, 'get_operating_system');
};
