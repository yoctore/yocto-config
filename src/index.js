'use strict';

var path     = require('path');
var _        = require('lodash');
var logger   = require('yocto-logger');
var joi      = require('joi');
var fs       = require('fs');
var glob     = require('glob');
var util     = require('util');
   
/**
 * Yocto config controller. <br/>
 * Manage your configuration file (all / common / env  & specific file)
 *
 * Config file has priority. And priority is defined like a php ini system.
 * (Other file).json < all.json < common.json < development.json < stagging.json < production.json
 *
 * All specific data must be configured on a each correct file.
 * 
 * all.json : contains general data (special keys, app name, etc) => not env data
 * common.json : must containt all common data between each env
 * development.json : must contains development data for development environnement
 * staging.json : must contains stagging data for staging environnement
 * production.json : must contains production data for production environnement 
 *
 * For more details on these dependencies read links below :
 * - yocto-logger : lab.yocto.digital:yocto-node-modules/yocto-logger.git
 * - Lodash : https://lodash.com/
 * - path : https://nodejs.org/api/path.html
 * - joi : https://github.com/hapijs/joi
 * - fs : https://nodejs.org/api/fs.html
 * - glob : https://www.npmjs.com/package/glob
 * 
 * @date : 12/05/2015
 * @author : ROBERT Mathieu <mathieu@yocto.re>
 * @copyright : Yocto SAS, All right reserved
 * @class Config
 */
function Config() {
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
    this.env = 'development';
    
    /**
     * Default base path
     * 
     * @property base
     * @type string
     */
    this.base = path.normalize([ './', __dirname ].join(''));
    
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
    this.schema = joi.object().min(1).keys({
      app : joi.object().required().keys({
        name        : joi.string().required().empty().min(3),
        stackError  : joi.boolean().required(),
        session     : joi.object().required().keys({
          timeout : joi.number().required()
        }).allow('timeout')        
      }).allow('name', 'stackError', 'session'),
      express : joi.object().required().keys({
        jsonp       : joi.boolean().required(),
        prettyHtml  : joi.boolean().required(),
        viewEngine  : joi.boolean().required().allow('jade'),
        filter      : joi.object().required().keys({
          rules : joi.string().required().empty(),
          by    : joi.string().required().allow('Content-Type'), // for the moment only allow content type
          level : joi.number().required().min(0).max(9)
        }).allow('rules', 'by', 'level'),
        session :  joi.object().required().keys({
          enable : joi.boolean().required(),
          options : joi.object().optional().keys({
            secret  : joi.string().required().min(8),
            name              : joi.string().required().min(5),
            secure            : joi.boolean().required(),
            genuuid           : joi.boolean().required(),            
            proxy             : joi.boolean().required(),
            resave            : joi.boolean().required(),
            saveUninitialized : joi.boolean().required()                        
          }).allow('secret', 'name', 'secure', 'genuuid', 'proxy', 'resave', 'saveUninitialized')
        }).allow('enable', 'options'),
        vhost : joi.object().required().keys({
          enable : joi.boolean().required(),
          options : joi.object().optional().keys({
            url     : joi.string().required(),
            aliases : joi.array().items(
              joi.string().required().empty()
            ),
            subdomains : joi.boolean().required(),
            http : joi.object().required().keys({
              redirect : joi.object().required().keys({
                type     : joi.number(),
                url      : joi.string().required().empty(),
                port     : joi.number().required()
              }).allow('type', 'url', 'port')
            }).allow('redirect') 
          }).allow('url', 'aliases', 'subdomains', 'http')
        }).allow('enable', 'options')
      }),
      env       : joi.string().required().valid([ 'development', 'staging', 'production' ]),
      port      : joi.number().required(),
      directory : joi.array().required().items([
        joi.object().required().keys({ models       :  joi.string().required().empty().min(3) }),
        joi.object().required().keys({ controllers  :  joi.string().required().empty().min(3) }),
        joi.object().required().keys({ views        :  joi.string().required().empty().min(3) }),
        joi.object().required().keys({ public       :  joi.string().required().empty().min(3) }),
        joi.object().required().keys({ icons        :  joi.string().required().empty().min(3) })                                
      ]),
      encrypt_key : joi.object().required().keys({
        key   : joi.string().required(),
        type  : joi.string().required().valid([ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ])
      })
    }).unknown(true);
}
    
/**
 * Default set function, a value to a specific params
 * 
 * @method set
 * @param {String} name current name to use
 * @param {String} value current value to assign on params name
 * @param {Boolean} value current value to assign on params name
 */
Config.prototype.set = function(name, value) {
  // check requirements
  if (!_.isUndefined(name) && _.isString(name) && !_.isEmpty(name)) {
    // need to normalize path ?
    if (name == 'base') {
      // is relative path ?
      if (value.charAt(0) == '.') {
        // normalize
        value = path.normalize([ process.cwd(), value ].join('/'));
      }
    }

    // assign value
    this[name] = value;  
  } else {
      this.logger.warning('[ Core.set ] - Invalid value given. name must be a string and not empty. Operation aborted !');
  }
  
  // retuning current instance
  return this;
};

/**
 * Return correct property from given name
 *
 * @method get 
 * @param {String} name the property name
 * @return {Mixed} needed data
 */
Config.prototype.get = function(name) {
  return this[name];
};

/**
 * Reload data
 *
* @method reload
 * @param {String} base if base exists and is valid reassign base and reload
 * @return {Boolean} true if load succeed false otherwise 
 */
Config.prototype.reload = function(base) {
  // check base before load for conditional assignation
  if (!_.isUndefined(base) && !_.isNull(base) && _.isString(base) && !_.isEmpty(base)) {
    this.base = base;
  }
  
  // return load statement
  return this.load();
};

/**
 * Default load function, load data from all.js constant file
 *
 * @method load
 * @return {Boolean} return true if load is ok false otherwise
 */
Config.prototype.load = function() {
  
  // any errors ?? try/catch it 
  try {
    // default config object
    var config = {};
    
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
    paths = _.sortBy(paths, function(p) {
      var all         = path.normalize([ this.base, 'all.json' ].join('/'));
      var common      = path.normalize([ this.base, 'common.json' ].join('/'));
      var development = path.normalize([ this.base, 'development.json' ].join('/'));
      var staging     = path.normalize([ this.base, 'staging.json' ].join('/'));
      var production  = path.normalize([ this.base, 'production.json' ].join('/'));
      
      // return data order
      return [ p == production, p == staging,  p == development, p == common, p == all, p == p ].join('|');                         
    }, this);
    
    // parse all and merge if no error
    _.each(paths, function(path) {
      var item = JSON.parse(fs.readFileSync(path, 'utf-8'));

      // merge data
      _.merge(config, item);

      // has current env ? if test return false stop env was founded
      return penv != path;
    });
    
    // validate !!!
    var result = joi.validate(config, this.get('schema'), { abortEarly : false });
    
    // has error
    if (!_.isNull(result.error)) {
      // parse details
      _.each(result.error.details, function(error) {
        this.logger.warning([ '[ Config.load ] - Cannot update config an error occured. Error is :', util.inspect(error, { depth : null }) ].join(' '));
      }, this);
      
      // throw exception error occured
      throw 'Config validation failed';
    }
    
    // build directory value to UPPERCASE constants
    _.each(config.directory, function(dir) {
      // build path
      var p = [ _.values(dir), 'directory' ].join('_').toLowerCase();

      // is relative path ?
      if (_.first(_.values(dir)).charAt(0) == '.') {
        p = path.normalize([ process.cwd(), p ].join('/'));              
      }

      // build key            
      var k = [ _.first(_.keys(dir)), 'directory' ].join('_').toUpperCase();
      
      // assign
      this[k] = p;
    }, this);
        
    // valid so assign config
    this.config = config;
    this.logger.info([ '[ Config.load ] - Success - Config file was changed with files based on :', this.base ].join(' '));
  } catch (e) {
      this.logger.error([ '[ Config.load ] - an error occured during load config file. Error is :', e ].join(' '));
      // return false otherwise
      return false;
  }

  // return true if all is ok
  return true;
};

/**
 * Export the ConfController
 */
module.exports = new (Config)();
