var joi   = require('joi');
var _     = require('lodash');
var utils = require('yocto-utils');

/**
 * Mongoose Config Schema
 *
 * @date : 07/10/2015
 * @author : ROBERT Mathieu <mathieu@yocto.re>
 * @copyright : Yocto SAS, All right reserved
 * @class ConfigMongoose
 */
function ConfigMongoose () {}

/**
 * Return current express js schema defintion
 *
 * @return {Object} default schema for mongoose configuration
 */
ConfigMongoose.prototype.getSchema = function () {

  // native parser. Exclude it because underscore keys is not a good practicies and hint failed
  // transformation will process at the end
  var nParser = {
    nativeParser : joi.boolean().default(false)
  };

  // replicaSet name. Exclude it because underscore keys is not a good practicies and hint failed
  // transformation will process at the end
  var rsName = {
    rsName : joi.string().required().empty().min(3)
  };

  // default db Options
  var dbOptions = _.extend({
    serializeFunctions  : joi.boolean().default(false),
    raw                 : joi.boolean().default(false),
    retryMiliSeconds    : joi.number().min(0).default(5000),
    numberOfRetries     : joi.number().min(0).default(5)
  }, utils.obj.underscoreKeys(nParser));

  // default schema
  var schema = joi.object().required().keys({
    uri     : joi.string().required().empty(),
    options : joi.object().default({}).keys({
      db          : joi.object().optional().keys(dbOptions),
      server      : joi.object().optional().keys({
        poolSize        : joi.number().min(5).default(5),
        ssl             : joi.boolean().default(false),
        sslValidate     : joi.boolean().default(true),
        sslCA           : joi.array().default(null),
        sslCert         : joi.string().default(null),
        sslKey          : joi.string().default(null),
        sslPass         : joi.string().default(null),
        autoReconnect   : joi.boolean().default(true),
        socketOptions   : joi.object().default({
          noDelay           : true,
          keepAlive         : 0,
          connectTimeoutMS  : 0,
          socketTimeoutMS   : 0
        }).keys({
          noDelay           : joi.boolean().default(true),
          keepAlive         : joi.number().min(0).default(0),
          connectTimeoutMS  : joi.number().min(0).default(0),
          socketTimeoutMS   : joi.number().min(0).default(0)
        }).allow([ 'noDelay', 'keepAlive', 'connectTimeoutMS', 'socketTimeoutMS' ])
      }).allow([ 'poolSize', 'ssl', 'sslValidate', 'sslCA',
                 'sslCert', 'sslKey', 'sslPass', 'autoReconnect', 'socketOptions']),
      replset     : joi.object().optional().keys(utils.obj.underscoreKeys(rsName)),
      user        : joi.string().optional().empty(),
      pass        : joi.string().optional().empty()
    }).allow([ 'db', 'server', 'replset', 'user', 'pass' ])
  });

  // default statement
  return schema;
};

// Default export
module.exports = new (ConfigMongoose)();
