const samDaemonService = require('./windows_service');

samDaemonService.on('install', () => {
  console.log('install event');
});

samDaemonService.on('alreadyinstalled', () => {
  console.log('alreadyinstalled event');
});

samDaemonService.on('invalidinstallation', () => {
  console.log('invalidinstallation event');
});

samDaemonService.on('uninstall', () => {
  console.log('uninstall event');
});

samDaemonService.on('start', () => {
  console.log('start event');
});

samDaemonService.on('stop', () => {
  console.log('stop event');
});

samDaemonService.on('error', () => {
  console.log('error event');
});

samDaemonService.uninstall();
