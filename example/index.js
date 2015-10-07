var config  = require('../src/index.js')();
var utils   = require('yocto-utils');
var joi     = require('joi');

// define new validation schema
var schema = joi.object().required().keys({
  mailer  : joi.object().required(),
  daemon  : joi.object().required(),
  core    : joi.object().keys({
    daemon : joi.object().default({ delay : 10, retry : 10 }).keys({
      delay : joi.number().min(0).default(10),
      retry : joi.number().min(0).default(10)
    }).allow([ 'delay', 'retry' ]),
    mailer : joi.object().default({ limit : 1, sort : 'ascending' }).keys({
      limit : joi.number().min(1).default(1),
      sort  : joi.string().empty().default('ascending').allow([ 'ascending', 'descending' ]),
    }).allow([ 'limit', 'sort' ])
  }).allow([ 'daemon', 'mailer' ])
}).unknown();

config.enableExpress(true);
config.enableMongoose(true);
config.enablePassportJs(true);
//config.addCustomSchema('test', schema, true, true);

//config.enableSchema('test');
console.log(config.schema);
config.set('base', './example/config');
config.load().then(function(data) {
  console.log(utils.obj.inspect(data));
}).catch(function(error) {
  console.log(error);
});
/*config.logger.enableConsole(true);
config.set('base', './example/config');
config.set('base', '/Users/yocto/Documents/Yocto/projets/yocto-node-modules/yocto-config/example/config');
config.load();
console.log(util.inspect(config.get('config'), { depth : null }));
*/
