'use strict';

var path            = require('path');
var _               = require('lodash');
var logger          = require('yocto-logger');
var joi             = require('joi');
var fs              = require('fs');
var glob            = require('glob');
var utils           = require('yocto-utils');
var Q               = require('q');
var configExpress   = require('./modules/express');
var configMongoose  = require('./modules/mongoose');
var configPassport  = require('./modules/passportjs');

/**
 * Yocto config manager.
 * Manage your configuration file (all / common / env  & specific file)
 *
 * Config file has priority. And priority is defined like a php ini system.
 * (Other file).json < all.json < common.json < development.json < stagging.json < production.json
 *
 * All specific data must be configured on a each correct file.
 *
 * all.json : contains general data
 * common.json : must contains all common data between each env
 * development.json : must contains development data for development environnement
 * staging.json : must contains stagging data for staging environnement
 * production.json : must contains production data for production environnement
 *
 * This Module use some security format rules based on Lusca NPM module : https://www.npmjs.com/package/lusca
 * - Cross Site Request Forgery (CSRF) headers : https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
 * - Content Security Policy (CSP) headers : https://www.owasp.org/index.php/Content_Security_Policy
 * - MDN CSP usage : https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Using_Content_Security_Policy
 * - X-FRAME-OPTIONS : https://www.owasp.org/index.php/Clickjacking
 * - Platform for Privacy Preferences Project (P3P) headers : http://support.microsoft.com/kb/290333
 * - HTTP Strict Transport Security (HSTS & Chrome HSTS preload) : https://www.owasp.org/index.php/HTTP_Strict_Transport_Security & https://hstspreload.appspot.com/
 * - XssProtection : http://blogs.msdn.com/b/ie/archive/2008/07/02/ie8-security-part-iv-the-xss-filter.aspx
 *
 * @date : 12/05/2015
 * @author : ROBERT Mathieu <mathieu@yocto.re>
 * @copyright : Yocto SAS, All right reserved
 * @class Config
 */
function Config (logger) {
  /**
   * Default config value
   *
   * @property config
   * @type {String}
   * @default {}
   */
  this.config = {};

  /**
   * Default state value, true if config state is or false otherwise
   */
  this.state  = false;
  /**
   * Default env value
   *
   * @property env
   * @type {String}
   * @default development
   */
  this.env    = process.NODE_ENV || 'development';

  /**
   * Default base path
   *
   * @property base
   * @type string
   */
  this.base   = process.cwd();

  /**
   * Default logger instance. can be override by set function
   *
   * @property logger
   * @type Object
   */
  this.logger = logger;

  /**
   * Default schema validation for config validator
   *
   * @property schema
   * @type Object
   */
  this.schemaList = {
    express     : configExpress.getSchema(),
    mongoose    : configMongoose.getSchema(),
    passportjs  : configPassport.getSchema()
  };

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
  // message
  this.logger.info([ '[ Config.find ] - Try to enable config for', name].join(' '));

  // search item
  var item = _.has(this.schemaList, name);

  // has item ?
  if (item) {
    // get value
    item = this.schemaList[name];

    // create default object
    var obj = _.set({}, name, item);

    // express item ??
    if (name === 'express' && _.has(obj, 'express')) {
      // change depth assign
      obj = obj.express;
    }

    // mongoose or sequelize item ?? transform to db
    if (name === 'mongoose' || name === 'sequelize') {
      // change object name for db
      obj = {
        db : obj[name]
      };
    }

    // add item at the end of list ?
    if (_.isBoolean(complete) && complete) {
      // not extend but merge current object
      _.merge(this.schema, obj);
    } else {
      // simple assignation
      this.schema = obj;
    }
    // message
    this.logger.info(['[ Config.find ] -', name, 'config was correcty activated.'].join(' '));
    // valid statement
    return true;
  }
  // default statement
  return false;
};

/**
 * Enable Express config
 *
 * @param {Boolean} complete true if we need to add new config after existing
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.enableExpress =  function (complete) {
  // force complete to be a boolean
  complete = _.isBoolean(complete) ? complete : false;
  // process
  return this.enableSchema('express', complete);
};

/**
 * Enable Mongoose config
 *
 * @param {Boolean} complete true if we need to add new config after existing
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.enableMongoose = function (complete) {
  // force complete to be a boolean
  complete = _.isBoolean(complete) ? complete : false;
  // process
  return this.enableSchema('mongoose', complete);
};

/**
 * Enable PassportJs config
 *
 * @param {Boolean} complete true if we need to add new config after existing
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.enablePassportJs = function (complete) {
  // force complete to be a boolean
  complete = _.isBoolean(complete) ? complete : false;
  // process
  return this.enableSchema('passportjs', complete);
};

/**
 * Enable Specific schema config
 *
 * @param {String} name default name to find in schema
 * @param {Boolean} complete true if we need to add new config after existing
 * @return {Boolean} true if all is ok falser otherwise
 */
Config.prototype.enableSchema = function (name, complete) {
  // force complete to be a boolean
  complete = _.isBoolean(complete) ? complete : false;
  // process
  return this.find(name, complete);
};

/**
 * Add a custom schema on config
 *
 * @param {String} name config name to add in schema
 * @param {Object} value config value to add in schema
 * @param {Boolean} enable true if we need to add auto enable of config
 * @param {Boolean} complete true if we need to add new config after existing
 */
Config.prototype.addCustomSchema = function (name, value, enable, complete) {
  // schema already exists ?
  if (_.has(this.schemaList, name) || !_.isObject(value)) {
    // error schema already exists
    this.logger.error([ '[ Config.addCustomerSchema ] - Cannot add new custom schema. Schema :',
                        name, 'already exist, or given value is invalid.' ].join(' '));
    // invalid schema
    return false;
  }

  // add new schema
  _.extend(this.schemaList, _.set({}, name, value));

  // auto enable ?
  if (_.isBoolean(enable) && enable) {
    // enable schema
    return this.enableSchema(name, complete);
  }

  // valid statement
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
  // check requirements
  if (!_.isUndefined(name) && _.isString(name) && !_.isEmpty(name)) {
    // need to normalize path ?
    if (name === 'base') {
      // is relative path ?
      if (!path.isAbsolute(value)) {
        // normalize
        value = path.normalize([ process.cwd(), value ].join('/'));
      }
    }

    // assign value
    this[name] = value;
    // valid statement
    return true;
  } else {
    // warn message
    this.logger.warning([ '[ Core.set ] - Invalid value given.',
                          'name must be a string and not empty. Operation aborted !' ].join(' '));
  }

  // invalid statement
  return false;
};

/**
 * Retreive default configuration
 *
 * @return {Object} loaded object
 */
Config.prototype.getConfig = function () {
  // default statement
  return this.get('config');
};

/**
 * Set config path
 *
 * @param {String} path default path to use
 * @return {Boolean} true if all is ok false otherwise
 */
Config.prototype.setConfigPath = function (path) {
  // default statement
  return this.set('base', path);
};

/**
 * Return correct property from given name
 *
 * @param {String} name the property name
 * @return {Mixed} needed data
 */
Config.prototype.get = function (name) {
  // default instance
  return this[name];
};

/**
 * Reload config from path
 *
 * @param {String} base if base exists and is valid reassign base and reload
 * @return {Boolean} true if load succeed false otherwise
 */
Config.prototype.reload = function (base) {
  // check base before load for conditional assignation
  if (_.isString(base) && !_.isEmpty(base)) {
    // change base
    this.base = base;
  }

  // return load statement
  return this.load();
};

/**
 * Load password schema for current configuration
 *
 * @return {Object} return current promise
 */
Config.prototype.loadPassport = function () {
  // retreive passport schema
  // this.schema = this.passport.get();
  // default statement
  return this.load();
};

/**
 * Default load function, load data from all.js constant file
 *
 * @return {Object} return current promise
 */
Config.prototype.load = function () {
  // create async process here
  var deferred = Q.defer();

  // any errors ?? try/catch it
  try {
    // default config object
    var config  = {};

    // build pattern
    var pattern = path.normalize([ this.base,  '*.json' ].join('/'));
    var penv    = path.normalize([ this.base,  [ this.env, '.json' ].join('') ].join('/'));

    // get file (sync mode)
    var paths = glob.sync(pattern);

    // has a valid path ? no ? stop process
    if (_.isEmpty(paths)) {
      throw 'No path was found. operation aborted !';
    }

    // sort path
    paths = _.sortBy(paths, function (p) {
      var all         = path.normalize([ this.base, 'all.json' ].join('/'));
      var common      = path.normalize([ this.base, 'common.json' ].join('/'));
      var development = path.normalize([ this.base, 'development.json' ].join('/'));
      var staging     = path.normalize([ this.base, 'staging.json' ].join('/'));
      var production  = path.normalize([ this.base, 'production.json' ].join('/'));

      // return data order
      return [ p === production, p === staging,
               p === development, p === common, p === all, p === p ].join('|');
    }, this);

    // parse all and merge if no error
    _.each(paths, function (path) {
      var item = JSON.parse(fs.readFileSync(path, 'utf-8'));

      // merge data
      _.merge(config, item);

      // has current env ? if test return false stop env was founded
      return penv !== path;
    });

    // build schema
    this.schema = joi.object().required().keys(this.schema).unknown(true);

    // validate !!!
    var result = joi.validate(config, this.schema, { abortEarly : false });

    // has error
    if (!_.isNull(result.error)) {
      // parse details
      _.each(result.error.details, function (error) {
        this.logger.warning([ '[ Config.load ] - Cannot update config an error occured. Error is :',
                              utils.obj.inspect(error) ].join(' '));
      }, this);

      // throw exception error occured
      throw 'Config validation failed';
    }

    // build directory value to UPPERCASE constants
    _.each(config.directory, function (dir) {
      // build path
      var p = _.first(_.values(dir));

      // is relative path ?
      if (!path.isAbsolute(p)) {
        p = path.normalize([ process.cwd(), p ].join('/'));
      }

      // build key
      var k = [ _.first(_.keys(dir)), 'directory' ].join('_').toUpperCase();

      // assign
      this[k] = p;
    }, this);

    // change state
    this.state = true;

    // valid so assign config
    this.config = result.value;
    // log message
    this.logger.info([ '[ Config.load ] - Success - Config file was changed with files based on :',
                       this.base ].join(' '));
    // resolve with valid value
    deferred.resolve(this.config);
  } catch (e) {
    // error message
    this.logger.error([ '[ Config.load ] - an error occured during load config file. Error is :',
                        e ].join(' '));
    // reject
    deferred.reject(e);
  }

  // return true if all is ok
  return deferred.promise;
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    logger.warning('[ Config.constructor ] - Invalid logger given. Use internal logger');
    // assign
    l = logger;
  }
  // default statement
  return new (Config)(l);
};
