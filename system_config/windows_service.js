const requireg = require('requireg');
const path = require('path');

// Global require
const Service = requireg('node-windows').Service;

// Create service object
module.exports = new Service({
  name: 'SAM Solution Daemon Client',
  description: 'System Administration Manager Solution: Localhost controller',
  script: path.resolve(__dirname, '../client.js'),
});
