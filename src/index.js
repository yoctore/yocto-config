'use strict';

var path    = require('path');
var _       = require('lodash');
var logger  = require('yocto-logger');
var joi     = require('joi');
var fs      = require('fs');
var glob    = require('glob');
var utils   = require('yocto-utils');
var Q       = require('q');
var schema  = require('./schema');

/**
 * Yocto config manager.
 * Manage your configuration file (all / common / env  & specific file)
 *
 * Config file has priority. And priority is defined like a php ini system.
 * `(Other file).json` < `all.json` < `common.json` < `development.json` < `stagging.json` < `production.json`
 *
 * All specific data must be configured on a each correct file.
 *
 * all.json : contains general data
 * common.json : must contains all common data between each env
 * development.json : must contains development data for development environnement
 * staging.json : must contains stagging data for staging environnement
 * production.json : must contains production data for production environnement
 *
 * This Module use some security format rules based on Lusca NPM module : {@link https://www.npmjs.com/package/lusca}
 * - Cross Site Request Forgery (CSRF) headers : {@link https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)}
 * - Content Security Policy (CSP) headers : {@link https://www.owasp.org/index.php/Content_Security_Policy}
 * - MDN CSP usage : {@link https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Using_Content_Security_Policy}
 * - X-FRAME-OPTIONS : {@link https://www.owasp.org/index.php/Clickjacking}
 * - Platform for Privacy Preferences Project (P3P) headers : {@link http://support.microsoft.com/kb/290333}
 * - HTTP Strict Transport Security (HSTS & Chrome HSTS preload) : {@link https://www.owasp.org/index.php/HTTP_Strict_Transport_Security} & {@link https://hstspreload.appspot.com/}
 * - XssProtection : {@link http://blogs.msdn.com/b/ie/archive/2008/07/02/ie8-security-part-iv-the-xss-filter.aspx}
 *
 * @date : 12/05/2015
 * @author : ROBERT Mathieu <mathieu@yocto.re>
 * @copyright : Yocto SAS, All right reserved
 * @class Config
 * @param {Object} logger Defaut yocto-logger instance
 */
function Config (logger) {
  /**
   * Default config value
   *
   * @public
   * @memberof Config
   * @member {Object} config
   * @default {}
   */
  this.config = {};

  /**
   * Default state value, true if config state is or false otherwise
   *
   * @public
   * @memberof Config
   * @member {Boolean} state
   * @default false
   */
  this.state = false;

  /**
   * Default env value
   *
   * @public
   * @memberof Config
   * @member {String} env
   * @default development
   */
  this.env = process.env.NODE_ENV || 'development';

  /**
   * Default base path
   *
   * @public
   * @memberof Config
   * @member {String} base
   */
  this.base = process.cwd();

  /**
   * Default logger instance. can be override by set function
   *
   * @public
   * @memberof Config
   * @member {Instance} logger
   */
  this.logger = logger;

  /**
   * Prefix to use in case of multiple configuration
   *
   * @public
   * @memberof Config
   * @member {String} prefix
   */
  this.suffix = process.env.CONFIG_SUFFIX_PATH || '';

  /**
   * Default schema validation for config validator
   *
   * @public
   * @memberof Config
   * @member {Object}schema
   * @default {
   *  express       : schema.getExpress(),
   *  mongoose      : schema.getMongoose(),
   *  passportJs    : schema.getPassportJs(),
   *  render        : schema.getRender(),
   *  router        : schema.getRouter()
   * }
   */

  this.schemaList = {
    express    : schema.getExpress(),
    mongoose   : schema.getMongoose(),
    passportJs : schema.getPassportJs(),
    render     : schema.getRender(),
    router     : schema.getRouter()
  };

  /**
   * Current schema to use for validation
   *
   * @public
   * @memberof Config
   * @property {Object} schema
   * @default {}
   */
  this.schema = {};
}

/**
 * Default find function, retreive a config from given name
 *
 * @param {String} name wanted config
 * @param {String} complete true if we need to complete existing config with new
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.find = function (name, complete) {
  // Message
  this.logger.debug([ '[ Config.find ] - Try to enable config for', name ].join(' '));

  // Search item
  var item = _.has(this.schemaList, name);

  // Has item ?
  if (item) {
    // Get value
    item = this.schemaList[name];

    // Create default object
    var obj = _.set({}, name, item);

    // Express item ??
    if (name === 'express' && _.has(obj, 'express')) {
      // Change depth assign
      obj = obj.express;
    }

    // Mongoose or sequelize item ?? transform to db
    if (name === 'mongoose' || name === 'sequelize') {
      // Change object name for db
      obj = {
        db : obj[name]
      };
    }

    // Add item at the end of list ?
    if (_.isBoolean(complete) && complete) {
      // Not extend but merge current object
      _.merge(this.schema, obj);
    } else {
      // Simple assignation
      this.schema = obj;
    }

    // Message
    this.logger.info([ '[ Config.find ] -', name, 'config was correcty activated.' ].join(' '));

    // Valid statement
    return true;
  }

  // Default statement
  return false;
};

/**
 * Enable Express config
 *
 * @param {Boolean} complete true if we need to append new config after existing
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.enableExpress = function (complete) {
  // Process
  return this.enableSchema('express', complete);
};

/**
 * Enable Yocto Render config
 *
 * @param {Boolean} complete true if we need to append new config after existing
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.enableRender = function (complete) {
  // Process
  return this.enableSchema('render', complete);
};

/**
 * Enable Yocto Router config
 *
 * @param {Boolean} complete true if we need to append new config after existing
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.enableRouter = function (complete) {
  // Process
  return this.enableSchema('router', complete);
};

/**
 * Enable Mongoose config
 *
 * @param {Boolean} complete true if we need to append new config after existing
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.enableMongoose = function (complete) {
  // Process
  return this.enableSchema('mongoose', complete);
};

/**
 * Enable PassportJs config
 *
 * @param {Boolean} complete true if we need to append new config after existing
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.enablePassportJs = function (complete) {
  // Process
  return this.enableSchema('passportJs', complete);
};

/**
 * Enable Specific schema config
 *
 * @param {String} name default name to find in schema
 * @param {Boolean} complete true if we need to add new config after existing
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.enableSchema = function (name, complete) {
  // Force complete to be a boolean
  complete = _.isBoolean(complete) ? complete : false;

  // Process
  return this.find(name, complete);
};

/**
 * Add a custom schema on config
 *
 * @param {String} name config name to add in schema
 * @param {Object} value config value to add in schema
 * @param {Boolean} enable true if we need to add auto enable of config
 * @param {Boolean} complete true if we need to add new config after existing
 * @return {Boolean} indicate success of this call
 */
Config.prototype.addCustomSchema = function (name, value, enable, complete) {
  // Schema already exists ?
  if (_.has(this.schemaList, name) || !_.isObject(value)) {
    // Error schema already exists
    this.logger.error([ '[ Config.addCustomerSchema ] - Cannot add new custom schema. Schema :',
      name, 'already exist, or given value is invalid.' ].join(' '));

    // Invalid schema
    return false;
  }

  // Add new schema
  _.extend(this.schemaList, _.set({}, name, value));

  // Auto enable ?
  if (_.isBoolean(enable) && enable) {
    // Enable schema
    return this.enableSchema(name, complete);
  }

  // Valid statement
  return _.has(this.schemaList, name);
};

/**
 * Default set function, a value to a specific params
 *
 * @param {String} name current name to use
 * @param {String} value current value to assign on params name
 * @return {Boolean} true if all is ok false otherwise
 */
Config.prototype.set = function (name, value) {
  // Check requirements
  if (!_.isUndefined(name) && _.isString(name) && !_.isEmpty(name)) {
    // Need to normalize path ?
    if (name === 'base') {
      // Is relative path ?
      if (!path.isAbsolute(value)) {
        // Normalize
        value = path.normalize([ process.cwd(), value ].join('/'));
      }
    }

    // Assign value
    this[name] = value;

    // Valid statement
    return true;
  }

  // Warn message
  this.logger.warning([ '[ Core.set ] - Invalid value given.',
    'name must be a string and not empty. Operation aborted !' ].join(' '));


  // Invalid statement
  return false;
};

/**
 * Retreive default configuration
 *
 * @return {Object} loaded object
 */
Config.prototype.getConfig = function () {
  // Default statement
  return this.get('config');
};

/**
 * Set config path
 *
 * @param {String} path default path to use
 * @return {Boolean} true if all is ok false otherwise
 */
Config.prototype.setConfigPath = function (path) {
  // Default statement
  return this.set('base', path);
};

/**
 * Return correct property from given name
 *
 * @param {String} name the property name
 * @return {Mixed} needed data
 */
Config.prototype.get = function (name) {
  // Default instance
  return this[name];
};

/**
 * Reload config from path
 *
 * @param {String} base if base exists and is valid reassign base and reload
 * @return {Boolean} true if load succeed false otherwise
 */
Config.prototype.reload = function (base) {
  // Check base before load for conditional assignation
  if (_.isString(base) && !_.isEmpty(base)) {
    // Change base
    this.base = base;
  }

  // Return load statement
  return this.load();
};

/**
 * Load password schema for current configuration
 *
 * @return {Object} return current promise
 */
Config.prototype.loadPassport = function () {
  // Retreive passport schema
  // this.schema = this.passport.get();
  // default statement
  return this.load();
};

/**
 * Auto enable validators schema for given list
 *
 * @param {Array} items array of items to enable
 * @return {Boolean} true if all is ok false otherwise
 */
Config.prototype.autoEnableValidators = function (items) {
  // Is valid format ?
  if (!_.isArray(items) || _.isEmpty(items)) {
    // Warn message invalid data
    this.logger.warning([ '[ Config.autoEnableValidator ] - Cannot check items.',
      'Is not an array or is empty.' ].join(' '));

    // Invalid statement
    return false;
  }

  // Parse item and check
  _.each(items, function (item) {
    // Schema exists ?
    if (_.has(this.schemaList, item)) {
      // Enable succeed ?
      if (!this.enableSchema(item, true)) {
        // Success or error ?
        this.logger.error([ '[ Config.autoEnableValidator ] - Auto enable [',
          item, '] failed' ].join(' '));
      }
    } else {
      // Warning
      this.logger.warning([ '[ Config.autoEnableValidator ] - Cannot enable [',
        item, '] schema does not exists' ].join(' '));
    }
  }.bind(this));

  // Default statement
  return true;
};

/**
 * Default load function, load data from all.js constant file
 *
 * @return {Object} return current promise
 */
Config.prototype.load = function () {
  // Create async process here
  var deferred = Q.defer();

  // Any errors ?? try/catch it
  try {
    // Default config object
    var config  = {};

    // Build pattern
    var pattern = path.normalize([ this.base, this.suffix, '*.json' ].join('/'));
    var penv    = path.normalize([ this.base, this.suffix, [
      this.env, '.json' ].join('')
    ].join('/'));

    // Get file (sync mode)
    var paths = glob.sync(pattern);

    // Has a valid path ? no ? stop process
    if (_.isEmpty(paths)) {
      throw 'No config files was found. Operation aborted !';
    }

    // Sort path
    paths = _.sortBy(paths, function (p) {
      var all         = path.normalize([ this.base, this.suffix, 'all.json' ].join('/'));
      var common      = path.normalize([ this.base, this.suffix, 'common.json' ].join('/'));
      var development = path.normalize([ this.base, this.suffix, 'development.json' ].join('/'));
      var staging     = path.normalize([ this.base, this.suffix, 'staging.json' ].join('/'));
      var production  = path.normalize([ this.base, this.suffix, 'production.json' ].join('/'));

      // Return data order
      return [ p === production, p === staging,
        p === development, p === common, p === all ].join('||');
    }.bind(this));

    // Parse all and merge if no error
    _.each(paths, function (path) {
      // Parse all file contains
      var item = JSON.parse(fs.readFileSync(path, 'utf-8'));

      // Merge data

      _.merge(config, item);

      // Has current env ? if test return false stop env was founded
      return penv !== path;
    });

    // Build schema
    this.schema = joi.object().required().keys(this.schema).unknown(true);

    // Validate !!!
    var result = joi.validate(config, this.schema, {
      abortEarly : false
    });

    // Has error
    if (!_.isNull(result.error)) {
      // Parse details
      _.each(result.error.details, function (error) {
        this.logger.warning([ '[ Config.load ] - Cannot update config an error occured. Error is :',
          utils.obj.inspect(error) ].join(' '));
      }.bind(this));

      // Throw exception error occured
      throw 'Config validation failed';
    }

    // Build directory value to UPPERCASE constants
    _.each(config.directory, function (dir) {
      // Build path
      var p = _.first(_.values(dir));

      // Is relative path ?
      if (!path.isAbsolute(p)) {
        p = path.normalize([ process.cwd(), p ].join('/'));
      }

      // Build key
      var k = [ _.first(_.keys(dir)), 'directory' ].join('_').toUpperCase();

      // Assign
      this[k] = p;
    }.bind(this));

    // Change state
    this.state = true;

    // Valid so assign config
    this.config = result.value;

    // Log message
    this.logger.info([ '[ Config.load ] - Success - Config file was changed with files based on :',
      [ this.base, this.suffix ].join('/') ].join(' '));

    // Resolve with valid value
    deferred.resolve(this.config);
  } catch (e) {
    // Error message
    this.logger.error([ '[ Config.load ] - an error occured during load config file. Error is :',
      e ].join(' '));

    // Reject
    deferred.reject(e);
  }

  // Return true if all is ok
  return deferred.promise;
};

// Default export
module.exports = function (l) {
  // Is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    logger.warning('[ Config.constructor ] - Invalid logger given. Use internal logger');

    // Assign
    l = logger;
  }

  // Default statement
  return new Config(l);
};
