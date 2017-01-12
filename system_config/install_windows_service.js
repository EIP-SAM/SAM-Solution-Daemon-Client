
const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name:'SAM Solution Daemon Client',
  description: 'System Administration Manager Solution: Localhost controller',
  script: path.resolve(__dirname + '/../client.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', () => {
  console.log('install event');
  svc.start();
});

svc.on('alreadyinstalled', () => {
  console.log('alreadyinstalled event');
});

svc.on('invalidinstallation', () => {
  console.log('invalidinstallation event');
});

svc.on('uninstall', () => {
  console.log('uninstall event');
});

svc.on('start', () => {
  console.log('start event');
});

svc.on('stop', () => {
  console.log('stop event');
});

svc.on('error', () => {
  console.log('error event');
});

svc.install();
