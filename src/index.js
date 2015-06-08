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
 * all.json : contains general data
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
    this.base = process.cwd();
    
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
      // default app rules
      app : joi.object().required().keys({
        name        : joi.string().required().empty().min(3),
        stackError  : joi.boolean().default(true),
        session     : joi.object().default({ timeout : 50000 }).keys({
          timeout : joi.number().default(500000)
        }).allow('timeout')        
      }).allow('name', 'stackError', 'session'),
      // express rules
      express : joi.object().required().keys({
        jsonp       : joi.boolean().default(false),
        prettyHtml  : joi.boolean().default(true),
        viewEngine  : joi.string().empty().default('jade').allow('jade'),
        filter      : joi.object().default({ rules : 'json|text|javascript|css|html', by : 'Content-type', level : 9 }).keys({
          rules : joi.string().default('json|text|javascript|css|html').empty(),
          by    : joi.string().default('Content-Type').allow('Content-Type'), // for the moment only allow content type
          level : joi.number().default(9).min(0).max(9)
        }).allow('rules', 'by', 'level'),
        // json mode rules
        json : joi.object().default({ inflate : true, limit : '100kb', strict : true, type : 'json' }).keys({
          inflate : joi.boolean().optional().default(true),
          limit   : joi.string().optional().empty().default('100kb'),
          strict  : joi.boolean().optional().default(true),
          type    : joi.string().optional().empty().default('json').valid('json')
        }).allow('inflate', 'limit', 'strict', 'type'),
        // url encoded rules
        urlencoded : joi.object().default({ extended : true,  inflate : true, limit : '100kb',  parameterLimit : 1000, type : 'urlencoded' }).keys({
          extended        : joi.boolean().optional().default(true),
          inflate         : joi.boolean().optional().default(true),
          limit           : joi.string().optional().empty().default('100kb'),
          parameterLimit  : joi.number().default(1000).min(1000),
          type    : joi.string().optional().empty().default('urlencoded').valid('urlencoded')          
        }).allow('extended', 'inflate', 'limit', 'parameterLimit', 'type', 'verify'),
        methodOverride : joi.array().min(1).unique().default([ '_method' ]).items([
         joi.string().empty().default('_method').valid('_method', 'X-HTTP-Method', 'X-HTTP-Method-Override', 'X-Method-Override')
        ]),
        // cookie parser rules
        cookieParser  : joi.object().default({ enable : false, secret : 'yocto-cookie-parser-secret-key', options : {} }).keys({
          enable  : joi.boolean().default(true),
          secret  : joi.string().empty().default('yocto-cookie-parser-secret-key'),
          options : joi.object().default({ path : '/', expires : 'Fri, 31 Dec 9999 23:59:59 GMT', maxAge : 0, domain : null, secure : true, httpOnly : true }).keys({
            path      : joi.string().empty().optional().default('/'),
            expires   : joi.string().empty().optional().default('Fri, 31 Dec 9999 23:59:59 GMT'),
            maxAge    : joi.number().optional().default(0),
            domain    : joi.string().empty().optional().default(null),
            secure    : joi.boolean().optional().default(true),
            httpOnly  : joi.boolean().optional().default(false),          
          }).allow('path', 'expires', 'maxAge', 'domain', 'secure', 'httpOnly')
        }).allow('enable', 'secret', 'options'),
        // upload rules
        multipart     : joi.boolean().default(false),        
        // session rules
        session :  joi.object().default({ enable : false }).keys({
          enable : joi.boolean().default(true),
          options : joi.object().optional().keys({
            cookie : joi.object().default({ path : '/', httpOnly : false, secure : true, maxAge : null }).keys({
              path      : joi.string().optional().default('/'),
              httpOnly  : joi.boolean().optional().default(false),              
            	secure    : joi.boolean().optional().default(true),
              maxAge    : joi.number().optional().default(null)
            }).allow('path', 'httpOnly', 'secure', 'maxAge'),
            secret            : joi.string().optional().min(8).default('yocto-config-secret-key'),
            name              : joi.string().optional().min(5).default('connect.sid'),
            genuuid           : joi.boolean().optional().default(false),            
            proxy             : joi.boolean().optional().default(undefined),
            resave            : joi.boolean().optional().default(false),
            saveUninitialized : joi.boolean().optional().default(true),
            rolling           : joi.boolean().optional().default(false),
          }).allow('cookie', 'secret', 'name', 'genuuid', 'proxy', 'resave', 'saveUninitialized', 'rolling')
        }).allow('enable', 'options'),
        // security rules see : https://www.npmjs.com/package/lusca
        security : joi.object().default({ csrf : { key : '_csrf', secret : 'yocto-csrf-secret-key' }, csp : {}, xframe : 'SAMEORIGIN', p3p : '_p3p', hsts : {}, xssProtection : true }).keys({
          csrf : joi.object().default({ key : '_csrf', secret : 'yocto-csrf-secret-key' }).keys({
            key : joi.string().empty().default('_csrf'),
            secret : joi.string().empty().default('yocto-csrf-secret-key')
          }),
          csp : joi.object().default({}).keys({
            policy     : joi.object().default({}).keys({
              'default-src'   : joi.string().empty(),
              'script-src'    : joi.string().empty(),
              'object-src'    : joi.string().empty(),
              'style-src'     : joi.string().empty(),
              'img-src'       : joi.string().empty(),
              'media-src'     : joi.string().empty(),
              'frame-src'     : joi.string().empty(),
              'font-src'      : joi.string().empty(),
              'connect-src'   : joi.string().empty(),
              'form-action '  : joi.string().empty(),
              'sandbox'       : joi.string().empty(),
              'script-nonce'  : joi.string().empty(),
              'plugin-types'  : joi.string().empty(),
              'reflected-xss' : joi.string().empty(),
              'report-uri'    : joi.string().empty(),
            }).allow('default-src', 'script-src', 'object-src', 'style-src', 'img-src', 'media-src', 'frame-src', 'font-src', 'connect-src', 'form-action', 'sandbox', 'script-nonce', 'plugin-types', 'reflected-xss', 'report-uri'),
            reportOnly : joi.boolean().default(false),
            reportUri  : joi.string()
          }).allow('policy', 'reportOnly', 'reportUri'),
          xframe : joi.string().empty().default('SAMEORIGIN').valid('DENY', 'SAMEORIGIN', 'ALLOW-FROM'),
          p3p : joi.string().empty().default('_p3p'),
          hsts : joi.object().default({ maxAge : 0, includeSubDomains : true, preload : true }).keys({
            maxAge : joi.number().optional().default(null),
            includeSubDomains : joi.boolean().default(true),
            preload : joi.boolean().default(true),            
          }),
          xssProtection : joi.boolean().default(true)
        }).allow('csrf', 'csp', 'xframe', 'p3p', 'hsts', 'xssProtection'), 
        // TODO : if we need to integrate vhost, we must to complete these rules
        vhost : joi.object().optional().keys({
          enable : joi.boolean().required().default(false),
          options : joi.object().optional().keys({
            url     : joi.string().required().default('/'),
            aliases : joi.array().items(
              joi.string().required().empty()
            ),
            subdomains : joi.boolean().required().default(false),
            http : joi.object().optional().keys({
              redirect : joi.object().required().keys({
                type     : joi.number(),
                url      : joi.string().required().empty(),
                port     : joi.number().required()
              }).allow('type', 'url', 'port')
            }).allow('redirect')
          }).allow('url', 'aliases', 'subdomains', 'http')
        }).allow('enable', 'options')
      }),
      env       : joi.string().default('development').empty().valid([ 'development', 'staging', 'production' ]),
      port      : joi.number().default(3000),
      directory : joi.array().min(1).unique().default([ { models : '/' }, { controllers : '/' }, { views : '/' }, { public : '/' }, { icons : '/' } ]).items([
        joi.object().required().keys({ models       :  joi.string().empty().min(2).default('/') }),
        joi.object().required().keys({ controllers  :  joi.string().empty().min(2).default('/') }),
        joi.object().required().keys({ views        :  joi.string().empty().min(2).default('/') }),
        joi.object().required().keys({ public       :  joi.string().empty().min(2).default('/') }),
        joi.object().required().keys({ icons        :  joi.string().empty().min(2).default('/') }),
        joi.object().empty()
      ]),
      encrypt_key : joi.object().default({ key : 'MyAppKey', type : 'hex' }).keys({
        key   : joi.string().default('MyAppKey').empty(),
        type  : joi.string().default('hex').valid([ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ])
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
      var p = _.first(_.values(dir));

      // is relative path ?
      if (p.charAt(0) == '.') {
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
