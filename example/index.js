var config = require('../src/index.js');
var util = require('util');

config.logger.enableConsole(true);
config.set('base', './example/config');
config.set('base', '/Users/yocto/Documents/Yocto/projets/yocto-node-modules/yocto-config/example/config');
config.load();
console.log(util.inspect(config.get('config'), { depth : null }));

