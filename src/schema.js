'use strict';

var joi   = require('joi');
var _     = require('lodash');
var utils = require('yocto-utils');

/**
 * Config Schema Class to manage each schema config for validation
 *
 * @date : 07/10/2015
 * @author : ROBERT Mathieu <mathieu@yocto.re>
 * @copyright : Yocto SAS, All right reserved
 * @class Schema
 */
function Schema () {
  /**
   * Default secret key for express value
   *
   * @public
   * @memberof Schema
   * @member {String} secretKey
   * @default yocto-secret-key
   */
  this.secretKey = 'yocto-secret-key';

  /**
   * Current date value for default expires value
   *
   * @public
   * @memberof Schema
   * @member {Date} date
   * @default new Date()
   */
  this.date = new Date();
}

/**
 * Return current express js schema defintion
 *
 * @return {Object} default schema for express configuration
 */
Schema.prototype.getExpress = function () {
  // Default schema
  var schema = {
    // Default app rules
    app : joi.object().required().keys({
      name       : joi.string().required().empty().min(3),
      stackError : joi.boolean().default(true),
      session    : joi.object().default({
        timeout : 50000
      }).keys({
        timeout : joi.number().default(50000)
      }).allow('timeout')
    }).allow([ 'name', 'stackError', 'session' ]),

    // Express rules
    express : joi.object().required().keys({
      // Express keys for static serving folder
      staticServe : joi.object().keys({
        maxAge       : joi.number().integer().min(0).default(0),
        lastModified : joi.boolean().default(true)
      }).default({}),
      jsonp      : joi.boolean().default(false),
      prettyHtml : joi.boolean().default(true),
      viewEngine : joi.string().empty().default('jade').allow('jade'),
      filter     : joi.object().default({
        rules : 'json|text|javascript|css|html',
        by    : 'Content-type',
        level : 9
      }).keys({
        rules : joi.string().default('json|text|javascript|css|html').empty(),

        // For the moment only allow content type
        by    : joi.string().default('Content-Type').allow('Content-Type'),
        level : joi.number().default(9).min(0).max(9)
      }).allow([ 'rules', 'by', 'level' ]),

      // Json mode rules
      json : joi.object().default({
        inflate : true,
        limit   : '100kb',
        strict  : true,
        type    : 'json'
      }).keys({
        inflate : joi.boolean().optional().default(true),
        limit   : joi.string().optional().empty().default('100kb'),
        strict  : joi.boolean().optional().default(true),
        type    : joi.string().optional().empty().default('json').valid('json')
      }).allow([ 'inflate', 'limit', 'strict', 'type' ]),

      // Url encoded rules
      urlencoded : joi.object().default({
        extended       : true,
        inflate        : true,
        limit          : '100kb',
        parameterLimit : 1000,
        type           : 'urlencoded'
      }).keys({
        extended       : joi.boolean().optional().default(true),
        inflate        : joi.boolean().optional().default(true),
        limit          : joi.string().optional().empty().default('100kb'),
        parameterLimit : joi.number().default(1000).min(1000),
        type           : joi.string().optional().empty().default('urlencoded').valid('urlencoded')
      }).allow([ 'extended', 'inflate', 'limit', 'parameterLimit', 'type', 'verify' ]),
      methodOverride : joi.array().min(1).unique().default([ '_method' ]).items([
        joi.string().empty().default('_method').valid([
          '_method',
          'X-HTTP-Method',
          'X-HTTP-Method-Override',
          'X-Method-Override'
        ])
      ]),

      // Cookie parser rules
      cookieParser : joi.object().default({
        enable  : false,
        secret  : 'yocto-cookie-parser-secret-key',
        options : {}
      }).keys({
        enable  : joi.boolean().default(true),
        secret  : joi.string().empty().default(this.secretKey),
        options : joi.object().default({
          path     : '/',
          expires  : this.date,
          maxAge   : 0,
          domain   : null,
          secure   : true,
          httpOnly : true
        }).keys({
          path     : joi.string().empty().optional().default('/'),
          expires  : joi.string().empty().optional().default(this.date),
          maxAge   : joi.number().optional().default(0),
          domain   : joi.string().empty().optional().default(null),
          secure   : joi.boolean().optional().default(true),
          httpOnly : joi.boolean().optional().default(false)
        }).allow([ 'path', 'expires', 'maxAge', 'domain', 'secure', 'httpOnly' ])
      }).allow([ 'enable', 'secret', 'options' ]),

      // Upload rules
      multipart : joi.boolean().default(false),

      // Session rules
      session : joi.object().default({
        enable : false
      }).keys({
        enable  : joi.boolean().default(true),
        options : joi.object().optional().keys({
          cookie : joi.object().default({
            path     : '/',
            httpOnly : false,
            secure   : true,
            maxAge   : null,
            domain   : null
          }).keys({
            path     : joi.string().optional().default('/'),
            httpOnly : joi.boolean().optional().default(false),
            secure   : joi.boolean().optional().default(true),
            maxAge   : joi.number().optional().default(null),
            domain   : joi.string().optional().default(null)
          }).allow([ 'path', 'httpOnly', 'secure', 'maxAge', 'domain' ]),
          secret            : joi.string().optional().min(8).default(this.secretKey),
          name              : joi.string().optional().min(5).default('connect.sid'),
          genuuid           : joi.boolean().optional().default(false),
          proxy             : joi.boolean().optional(),
          resave            : joi.boolean().optional().default(false),
          saveUninitialized : joi.boolean().optional().default(true),
          store             : joi.object().optional().keys({
            instance : joi.string().required().empty().valid('mongo'),
            uri      : joi.string().required().empty(),
            type     : joi.string().required().empty().valid([ 'mongoose', 'native', 'uri' ]),
            options  : joi.object().optional().keys({
              ssl                 : joi.boolean().optional(),
              sslValidate         : joi.boolean().optional(),
              sslCA               : joi.string().optional().empty(),
              sslKey              : joi.string().optional().empty(),
              sslCert             : joi.string().optional().empty(),
              checkServerIdentity : joi.boolean().optional()
            }).unknown()
          }).allow([ 'db', 'uri', 'type', 'options' ]),
          rolling : joi.boolean().optional().default(false)
        }).allow([ 'cookie', 'secret', 'name', 'genuuid',
          'proxy', 'resave', 'saveUninitialized', 'rolling' ])
      }).allow([ 'enable', 'options' ]),

      // Security rules see : https://www.npmjs.com/package/lusca
      security : joi.object().default({
        enable : true,
        csrf   : {
          key     : '_csrf',
          secret  : this.secretKey,
          angular : true
        },
        csp : {
          policy : {
            'default-src'   : 'none',
            'script-src'    : '\'self\'',
            'object-src'    : '\'self\'',
            'style-src'     : '\'self\'',
            'img-src'       : '\'self\'',
            'media-src'     : '\'self\'',
            'child-src'     : '\'self\'',
            'font-src'      : '\'self\'',
            'connect-src'   : '\'self\'',
            'form-action'   : '\'self\'',
            sandbox         : 'allow-forms allow-scripts',
            'script-nonce'  : '\'self\'',
            'plugin-types'  : '\'self\'',
            'reflected-xss' : '\'self\'',
            'report-uri'    : '\'self\''
          },
          reportOnly : false
        },
        xframe : 'SAMEORIGIN',
        p3p    : '_p3p',
        hsts   : {
          maxAge            : 0,
          includeSubDomains : true,
          preload           : true
        },
        xssProtection : true,
        nosniff       : true
      }).keys({
        enable : joi.boolean().default(true),
        csrf   : joi.object().default({
          key     : '_csrf',
          secret  : this.secretKey,
          angular : true
        }).keys({
          key     : joi.string().empty().default('_csrf'),
          secret  : joi.string().empty().default(this.secretKey),
          angular : joi.boolean().default(true)
        }),
        csp : joi.object().default({
          policy : {
            'default-src' : 'none',
            'script-src'  : '\'self\'',
            'object-src'  : '\'self\'',
            'style-src'   : '\'self\'',
            'img-src'     : '\'self\'',
            'media-src'   : '\'self\'',
            'child-src'   : '\'self\'',
            'font-src'    : '\'self\'',
            'connect-src' : '\'self\'',
            'form-action' : '\'self\'',

            // NOTE DISABLE THIS FOR CHROME ISSUE WITH FLASH
            // 'sandbox'       : 'allow-forms allow-scripts',
            'script-nonce'  : '\'self\'',
            'plugin-types'  : '\'self\'',
            'reflected-xss' : '\'self\'',
            'report-uri'    : '\'self\''
          },
          reportOnly : false
        }).keys({
          policy : joi.object().default({
            'default-src' : 'none',
            'script-src'  : '\'self\'',
            'object-src'  : '\'self\'',
            'style-src'   : '\'self\'',
            'img-src'     : '\'self\'',
            'media-src'   : '\'self\'',
            'child-src'   : '\'self\'',
            'font-src'    : '\'self\'',
            'connect-src' : '\'self\'',
            'form-action' : '\'self\'',

            // NOTE DISABLE THIS FOR CHROME ISSUE WITH FLASH
            // 'sandbox'       : 'allow-forms allow-scripts',
            'script-nonce'  : '\'self\'',
            'plugin-types'  : '\'self\'',
            'reflected-xss' : '\'self\'',
            'report-uri'    : '\'self\''
          }).keys({
            'default-src' : joi.string().empty().default('none'),
            'script-src'  : joi.string().empty().default('\'self\''),
            'object-src'  : joi.string().empty().default('\'self\''),
            'style-src'   : joi.string().empty().default('\'self\''),
            'img-src'     : joi.string().empty().default('\'self\''),
            'media-src'   : joi.string().empty().default('\'self\''),
            'child-src'   : joi.string().empty().default('\'self\''),
            'font-src'    : joi.string().empty().default('\'self\''),
            'connect-src' : joi.string().empty().default('\'self\''),
            'form-action' : joi.string().empty().default('\'self\''),

            //  NOTE DISABLE THIS FOR CHROME ISSUE WITH FLASH
            //  'sandbox'       : joi.string().empty().default('allow-forms allow-scripts'),
            sandbox         : joi.string().optional().empty(),
            'script-nonce'  : joi.string().empty().default('\'self\''),
            'plugin-types'  : joi.string().empty().default('\'self\''),
            'reflected-xss' : joi.string().empty().default('\'self\''),
            'report-uri'    : joi.string().empty().default('\'self\'')
          }).allow([ 'default-src', 'script-src', 'object-src', 'style-src',
            'img-src', 'media-src', 'child-src', 'font-src', 'connect-src',
            'form-action', 'sandbox', 'script-nonce', 'plugin-types',
            'reflected-xss', 'report-uri' ]),
          reportOnly : joi.boolean().default(false),
          reportUri  : joi.string()
        }).allow('policy', 'reportOnly', 'reportUri'),
        xframe : joi.string().empty().default('SAMEORIGIN'),
        p3p    : joi.string().empty().default('_p3p'),
        hsts   : joi.object().default({
          maxAge            : 0,
          includeSubDomains : true,
          preload           : true
        }).keys({
          maxAge            : joi.number().optional().default(null),
          includeSubDomains : joi.boolean().default(true),
          preload           : joi.boolean().default(true)
        }),
        xssProtection : joi.boolean().default(true),
        nosniff       : joi.boolean().default(true)
      }).allow([ 'csrf', 'csp', 'xframe', 'p3p', 'hsts', 'xssProtection', 'nosniff' ]),

      // TODO : if we need to integrate vhost, we must to complete these rules
      vhost : joi.object().optional().keys({
        enable  : joi.boolean().required().default(false),
        options : joi.object().optional().keys({
          url        : joi.string().required().default('/'),
          aliases    : joi.array().items(joi.string().required().empty()),
          subdomains : joi.boolean().required().default(false),
          http       : joi.object().optional().keys({
            redirect : joi.object().required().keys({
              type : joi.number(),
              url  : joi.string().required().empty(),
              port : joi.number().required()
            }).allow([ 'type', 'url', 'port' ])
          }).allow('redirect')
        }).allow([ 'url', 'aliases', 'subdomains', 'http' ])
      }).allow([ 'enable', 'options' ])
    }),
    host     : joi.string().default('127.0.0.1').empty(),
    protocol : joi.object().default({
      type : 'http'
    }).keys({
      type : joi.string().default('http').valid([ 'http', 'https' ]),
      port : joi.number().when('type', {
        is        : 'http',
        then      : joi.number().default(3000),
        otherwise : joi.number().default(443)
      }),
      certificate : joi.object().when('type', {
        is        : 'http',
        then      : joi.optional(),
        otherwise : joi.object().required().keys({
          key  : joi.string().required().empty(),
          cert : joi.string().required().empty()
        })
      })
    }),
    directory : joi.array().optional().min(1).unique().default([
      {
        models : '/'
      },
      {
        controllers : '/'
      },
      {
        views : '/'
      },
      {
        public : '/'
      },
      {
        icons : '/'
      }
    ]).items([
      joi.object().keys({
        models : joi.string().empty().min(1).default('/')
      }),
      joi.object().keys({
        controllers : joi.string().empty().min(1).default('/')
      }),
      joi.object().keys({
        views : joi.string().empty().min(1).default('/')
      }),
      joi.object().keys({
        public : joi.string().empty().min(1).default('/')
      }),
      joi.object().keys({
        icons : joi.string().empty().min(1).default('/')
      }),
      joi.object().empty()
    ]),

    encrypt : joi.object().default({
      key  : this.secretKey,
      type : 'hex'
    }).keys({
      key  : joi.string().default(this.secretKey).empty(),
      type : joi.string().default('hex').valid([
        'ascii',
        'utf8',
        'utf16le',
        'ucs2',
        'base64',
        'binary',
        'hex'
      ])
    }),
    jwt : joi.object().default({
      enable : false,
      key    : this.secretKey,
      ips    : []
    }).keys({
      enable              : joi.boolean().default(false),
      key                 : joi.string().default(this.secretKey),
      ips                 : joi.array().items(joi.string().required().empty()),
      allowedRoutes       : joi.array().optional().items(joi.string().required().empty()),
      ignoreDecryptRoutes : joi.array().optional().items(joi.string().required().empty()),
      autoEncryptRequest  : joi.boolean().optional().default(true),
      autoDecryptRequest  : joi.boolean().optional().default(true)
    }),
    cors    : joi.boolean().default(false),
    corsCfg : joi.object().optional().keys({
      origin : joi.array().optional().items(
        joi.string().required().empty()
      ),
      methods : joi.array().optional().items(
        joi.string().required().empty().valid([
          'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'
        ])
      ),
      allowedHeaders    : joi.array().optional().items(joi.string().required().empty()),
      exposedHeaders    : joi.array().optional().items(joi.string().required().empty()),
      credentials       : joi.boolean().optional(),
      maxAge            : joi.number().optional(),
      preflightContinue : joi.boolean().optional()
    }).allow([ 'origin', 'methods', 'allowedHeaders',
      'exposedHeaders', 'credentials', 'maxAge', 'preflightContinue' ]),
    redirect : joi.object().optional().keys({
      www : joi.boolean().optional(),
      seo : joi.array().optional().items(joi.object().required().keys({
        code        : joi.number().required(),
        fromUrl     : joi.string().required().empty(),
        toUrl       : joi.string().required().empty(),
        queryString : joi.boolean().optional()
      }))
    })
  };

  // Default statement
  return schema;
};

/**
 * Return current mongoose schema defintion
 *
 * @return {Object} default schema for mongoose configuration
 */
Schema.prototype.getMongoose = function () {
  // Native parser. Exclude it because underscore keys is not a good practicies and hint failed
  // transformation will process at the end
  var nParser = {
    nativeParser : joi.boolean().default(false)
  };

  // ReplicaSet name. Exclude it because underscore keys is not a good practicies and hint failed
  // transformation will process at the end
  var rsName = {
    rsName : joi.string().required().empty().min(3)
  };

  // Default db Options
  var dbOptions = _.extend({
    serializeFunctions : joi.boolean().default(false),
    raw                : joi.boolean().default(false),
    retryMiliSeconds   : joi.number().min(0).default(5000),
    numberOfRetries    : joi.number().min(0).default(5)
  }, utils.obj.underscoreKeys(nParser));

  // Default schema
  var schema = joi.object().required().keys({
    type    : joi.string().default('mongoose').allow([ 'mongoose' ]),
    uri     : joi.string().required().empty(),
    options : joi.object().default({}).keys({
      db     : joi.object().optional().keys(dbOptions),
      server : joi.object().optional().keys({
        poolSize      : joi.number().min(5).default(5),
        ssl           : joi.boolean().default(false),
        sslValidate   : joi.boolean().default(true),
        sslCA         : joi.array().default(null),
        sslCert       : joi.string().default(null),
        sslKey        : joi.string().default(null),
        sslPass       : joi.string().default(null),
        autoReconnect : joi.boolean().default(true),
        socketOptions : joi.object().default({
          noDelay          : true,
          keepAlive        : 0,
          connectTimeoutMS : 0,
          socketTimeoutMS  : 0
        }).keys({
          noDelay          : joi.boolean().default(true),
          keepAlive        : joi.number().min(0).default(0),
          connectTimeoutMS : joi.number().min(0).default(0),
          socketTimeoutMS  : joi.number().min(0).default(0)
        }).allow([ 'noDelay', 'keepAlive', 'connectTimeoutMS', 'socketTimeoutMS' ])
      }).allow([ 'poolSize', 'ssl', 'sslValidate', 'sslCA',
        'sslCert', 'sslKey', 'sslPass', 'autoReconnect', 'socketOptions' ]),
      replset : joi.object().optional().keys(utils.obj.underscoreKeys(rsName)),
      user    : joi.string().optional().empty(),
      pass    : joi.string().optional().empty()
    }).allow([ 'db', 'server', 'replset', 'user', 'pass' ])
  });

  // Default statement
  return schema;
};

/**
 * Return current passport js schema defintion
 *
 * @return {Object} default schema for passport configuration
 */
Schema.prototype.getPassportJs = function () {
  // Default validation schema
  var baseSchema = {
    identifier : joi.string().required().empty().default(null),
    secret     : joi.string().required().empty(),
    urls       : joi.object().required().keys({
      connect  : joi.string().required().empty(),
      callback : joi.string().required().empty()
    }),
    db : joi.object().required().keys({
      method : joi.string().required().empty()
    })
  };

  // Facebook Keys definition
  var facebookKeys = _.extend(_.clone(baseSchema), {
    fields : joi.array().required().items(
      joi.string().valid([ 'id', 'name', 'gender', 'displayName',
        'photos', 'emails', 'profileUrl'
      ])
    )
  });

  // Twitter Keys definition
  var twitterKeys         = _.clone(baseSchema);

  // Google Keys definition
  var googleKeys          = _.extend(_.clone(baseSchema), {
    scope : joi.array().required().items(joi.string().required().empty()).min(1)
  });

  // Ad Keys definition
  var activeDirectoryKeys = _.extend(_.omit(_.clone(baseSchema), [ 'identifier', 'secret' ]), {
    server : joi.object().required().keys({
      bindDn          : joi.string().required().empty(),
      bindCredentials : joi.string().required().empty(),
      url             : joi.string().required().empty(),
      searchBase      : joi.string().required().empty(),
      searchFilter    : joi.string().required().empty()
    })
  });

  // Standard auth
  var standardAuthKeys =  _.omit(_.clone(baseSchema), [ 'identifier', 'secret', 'callback' ]);

  // Default schema
  var schema = joi.object().required().keys({
    internalUrlRedirect : joi.string().required().empty(),
    facebook            : joi.object().optional().keys(facebookKeys),
    twitter             : joi.object().optional().keys(twitterKeys),
    google              : joi.object().optional().keys(googleKeys),
    activeDirectory     : joi.array().optional().items(activeDirectoryKeys),
    standard            : joi.array().optional().items(standardAuthKeys)
  }).unknown();

  // Default statement
  return schema;
};

/**
 * Return current Render schema defintion
 *
 * @return {Object} default schema for passport configuration
 */
Schema.prototype.getRender = function () {
  // Define meta rules
  var metaHttpEquivRules = joi.object().keys({
    name  : joi.string().required().not(null),
    value : joi.string().required().not(null)
  });

  // Setting css media rules
  var cssMediaRules = joi.object().keys({
    host : joi.string().uri({
      scheme : [ 'http', 'https' ]
    }).optional().empty(),
    link        : joi.string().required().not(null),
    media       : joi.string().required().not(null),
    defer       : joi.string().optional().allow('defer').not(null),
    async       : joi.string().optional().allow('async').not(null),
    fingerprint : joi.object().optional().keys({
      enable     : joi.boolean().required().default(false),
      key        : joi.string().optional().default(this.uuid),
      dateFormat : joi.string().optional().default('DD/MM/YYYY'),
      qs         : joi.string().optional().empty().default('v'),
      limit      : joi.number().optional().min(1)
    }),
    base64 : joi.object().optional().keys({
      enable : joi.boolean().required().default(false),
      qs     : joi.string().optional().empty().default('r')
    })
  });

  // Setting js media rules
  var jsMediaRules = joi.object().keys({
    host : joi.string().uri({
      scheme : [ 'http', 'https' ]
    }).optional().empty(),
    link        : joi.string().required().not(null),
    defer       : joi.string().optional().allow('defer').not(null),
    async       : joi.string().optional().allow('async').not(null),
    fingerprint : joi.object().optional().keys({
      enable     : joi.boolean().required().default(false),
      key        : joi.string().optional().default(this.uuid),
      dateFormat : joi.string().optional().default('DD/MM/YYYY'),
      qs         : joi.string().optional().empty().default('v'),
      limit      : joi.number().optional().min(1)
    }),
    base64 : joi.object().optional().keys({
      enable : joi.boolean().required().default(false),
      qs     : joi.string().optional().empty().default('r')
    })
  });

  // Setting up media type rules
  var mediaTypeRules = {
    css : joi.array().optional().min(1).items(cssMediaRules),
    js  : joi.array().optional().min(1).items(jsMediaRules)
  };

  // Setting up assets rules
  var assetsRules = {
    header : joi.object().optional().min(1).keys(mediaTypeRules),
    footer : joi.object().optional().min(1).keys(mediaTypeRules)
  };

  // Facebook twitter keys
  var facebookTwitterKeys = {
    property : joi.string().required().empty(),
    content  : joi.string().required().empty()
  };

  // Google keys
  var googleKeys = {
    rel  : joi.string().required().empty(),
    href : joi.string().required().empty()
  };

  // Setting up social keys
  var socialRules = {
    facebook : joi.array().optional().items(facebookTwitterKeys).default([]),
    twitter  : joi.array().optional().items(facebookTwitterKeys).default([]),
    google   : joi.array().optional().items(googleKeys).default([])
  };

  // Default statement
  return joi.object().required().keys({
    app : joi.object().optional().min(1).keys({
      name : joi.string().required().min(3).not(null).empty()
    }),

    // Property list
    property : joi.object().optional().min(1).keys({
      title       : joi.string().optional().min(3).not(null),
      language    : joi.string().optional().length(2).not(null),
      meta        : joi.array().optional().min(1).items(metaHttpEquivRules),
      httpEquiv   : joi.array().optional().min(1).items(metaHttpEquivRules),
      assets      : joi.object().optional().min(1).keys(assetsRules),
      mobileIcons : joi.array().optional().min(1).items(
        joi.object().required().keys({
          rel   : joi.string().required().empty(),
          sizes : joi.string().required().empty(),
          href  : joi.string().required().empty()
        })
      ),
      social : joi.object().optional().min(1).keys(socialRules)
    })
  }).allow([ 'app', 'property' ]);
};

/**
 * Return current router schema defintion
 *
 * @return {Object} default schema for passport configuration
 */
Schema.prototype.getRouter = function () {
  // Default statement
  return joi.object().required().keys({
    routes      : joi.string().required().empty().default(),
    controllers : joi.string().required().empty().default()
  }).allow([ 'routes', 'controllers' ]);
};

// Default export
module.exports = new Schema();
