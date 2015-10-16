var joi = require('joi');

/**
 * ExpressJs Config Schema
 *
 * @date : 07/10/2015
 * @author : ROBERT Mathieu <mathieu@yocto.re>
 * @copyright : Yocto SAS, All right reserved
 * @class ExpressJs
 */
function ConfigExpressJs () {
  /**
   * Default secret key for default value
   *
   * @property secretKey
   * @type {String}
   * @default yocto-secret-key
   */
  this.secretKey = 'yocto-secret-key';

  /**
   * Current date value for default expires value
   *
   * @property date
   * @type {String}
   */
  this.date      = new Date();
}

/**
 * Return current express js schema defintion
 *
 * @return {Object} default schema for express configuration
 */
ConfigExpressJs.prototype.getSchema = function () {
  // default schema
  var schema = {
    // default app rules
    app       : joi.object().required().keys({
      name        : joi.string().required().empty().min(3),
      stackError  : joi.boolean().default(true),
      session     : joi.object().default({ timeout : 50000 }).keys({
        timeout : joi.number().default(50000)
      }).allow('timeout')
    }).allow([ 'name', 'stackError', 'session' ]),
    // express rules
    express   : joi.object().required().keys({
      jsonp           : joi.boolean().default(false),
      prettyHtml      : joi.boolean().default(true),
      viewEngine      : joi.string().empty().default('jade').allow('jade'),
      filter          : joi.object().default({
        rules : 'json|text|javascript|css|html',
        by    : 'Content-type',
        level : 9
      }).keys({
        rules : joi.string().default('json|text|javascript|css|html').empty(),
        // for the moment only allow content type
        by    : joi.string().default('Content-Type').allow('Content-Type'),
        level : joi.number().default(9).min(0).max(9)
      }).allow([ 'rules', 'by', 'level' ]),
      // json mode rules
      json            : joi.object().default({
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
      // url encoded rules
      urlencoded      : joi.object().default({
        extended        : true,
        inflate         : true,
        limit           : '100kb',
        parameterLimit  : 1000,
        type            : 'urlencoded'
      }).keys({
        extended        : joi.boolean().optional().default(true),
        inflate         : joi.boolean().optional().default(true),
        limit           : joi.string().optional().empty().default('100kb'),
        parameterLimit  : joi.number().default(1000).min(1000),
        type            : joi.string().optional().empty().default('urlencoded').valid('urlencoded')
      }).allow([ 'extended', 'inflate', 'limit', 'parameterLimit', 'type', 'verify' ]),
      methodOverride  : joi.array().min(1).unique().default([ '_method' ]).items([
        joi.string().empty().default('_method').valid([
          '_method',
          'X-HTTP-Method',
          'X-HTTP-Method-Override',
          'X-Method-Override'
        ])
      ]),
      // cookie parser rules
      cookieParser    : joi.object().default({
        enable  : false,
        secret  : 'yocto-cookie-parser-secret-key',
        options : {}
      }).keys({
        enable  : joi.boolean().default(true),
        secret  : joi.string().empty().default(this.secretKey),
        options : joi.object().default({
          path      : '/',
          expires   : this.date,
          maxAge    : 0,
          domain    : null,
          secure    : true,
          httpOnly  : true
        }).keys({
          path      : joi.string().empty().optional().default('/'),
          expires   : joi.string().empty().optional().default(this.date),
          maxAge    : joi.number().optional().default(0),
          domain    : joi.string().empty().optional().default(null),
          secure    : joi.boolean().optional().default(true),
          httpOnly  : joi.boolean().optional().default(false),
        }).allow([ 'path', 'expires', 'maxAge', 'domain', 'secure', 'httpOnly' ])
      }).allow([ 'enable', 'secret', 'options' ]),
      // upload rules
      multipart       : joi.boolean().default(false),
      // session rules
      session         :  joi.object().default({ enable : false }).keys({
        enable  : joi.boolean().default(true),
        options : joi.object().optional().keys({
          cookie            : joi.object().default({
            path      : '/',
            httpOnly  : false,
            secure    : true,
            maxAge    : null
          }).keys({
            path      : joi.string().optional().default('/'),
            httpOnly  : joi.boolean().optional().default(false),
            secure    : joi.boolean().optional().default(true),
            maxAge    : joi.number().optional().default(null)
          }).allow([ 'path', 'httpOnly', 'secure', 'maxAge' ]),
          secret            : joi.string().optional().min(8).default(this.secretKey),
          name              : joi.string().optional().min(5).default('connect.sid'),
          genuuid           : joi.boolean().optional().default(false),
          proxy             : joi.boolean().optional().default(undefined),
          resave            : joi.boolean().optional().default(false),
          saveUninitialized : joi.boolean().optional().default(true),
          store             : joi.object().optional().keys({
            instance  : joi.string().required().empty().valid('mongo'),
            uri       : joi.string().required().empty(),
            type      : joi.string().required().empty().valid([ 'mongoose', 'native', 'uri' ])
          }).allow([ 'db', 'uri', 'type' ]),
          rolling           : joi.boolean().optional().default(false),
        }).allow([ 'cookie', 'secret', 'name', 'genuuid',
                   'proxy', 'resave', 'saveUninitialized', 'rolling' ])
      }).allow([ 'enable', 'options' ]),
      // security rules see : https://www.npmjs.com/package/lusca
      security        : joi.object().default({
        csrf          : {
          key     : '_csrf',
          secret  : this.secretKey
        },
        csp           : {},
        xframe        : 'SAMEORIGIN',
        p3p           : '_p3p',
        hsts          : {},
        xssProtection : true
      }).keys({
        csrf          : joi.object().default({
          key     : '_csrf',
          secret  : this.secretKey
        }).keys({
          key     : joi.string().empty().default('_csrf'),
          secret  : joi.string().empty().default(this.secretKey)
        }),
        csp           : joi.object().default({}).keys({
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
          }).allow([ 'default-src', 'script-src', 'object-src', 'style-src',
                     'img-src', 'media-src', 'frame-src', 'font-src', 'connect-src',
                     'form-action', 'sandbox', 'script-nonce', 'plugin-types',
                     'reflected-xss', 'report-uri' ]),
          reportOnly : joi.boolean().default(false),
          reportUri  : joi.string()
        }).allow('policy', 'reportOnly', 'reportUri'),
        xframe        : joi.string().empty().default('SAMEORIGIN').valid([
          'DENY',
          'SAMEORIGIN',
          'ALLOW-FROM'
        ]),
        p3p           : joi.string().empty().default('_p3p'),
        hsts          : joi.object().default({
          maxAge            : 0,
          includeSubDomains : true,
          preload           : true
        }).keys({
          maxAge            : joi.number().optional().default(null),
          includeSubDomains : joi.boolean().default(true),
          preload           : joi.boolean().default(true)
        }),
        xssProtection : joi.boolean().default(true)
      }).allow([ 'csrf', 'csp', 'xframe', 'p3p', 'hsts', 'xssProtection' ]),
      // TODO : if we need to integrate vhost, we must to complete these rules
      vhost           : joi.object().optional().keys({
        enable  : joi.boolean().required().default(false),
        options : joi.object().optional().keys({
          url         : joi.string().required().default('/'),
          aliases     : joi.array().items(joi.string().required().empty()),
          subdomains  : joi.boolean().required().default(false),
          http        : joi.object().optional().keys({
            redirect : joi.object().required().keys({
              type     : joi.number(),
              url      : joi.string().required().empty(),
              port     : joi.number().required()
            }).allow([ 'type', 'url', 'port' ])
          }).allow('redirect')
        }).allow([ 'url', 'aliases', 'subdomains', 'http' ])
      }).allow([ 'enable', 'options' ])
    }),
    port      : joi.number().default(3000),
    host      : joi.string().default('127.0.0.1').empty().min(7),
    directory : joi.array().optional().min(1).unique().default([
      { models      : '/' },
      { controllers : '/' },
      { views       : '/' },
      { public      : '/' },
      { icons       : '/' }
    ]).items([
      joi.object().keys({ models       :  joi.string().empty().min(1).default('/') }),
      joi.object().keys({ controllers  :  joi.string().empty().min(1).default('/') }),
      joi.object().keys({ views        :  joi.string().empty().min(1).default('/') }),
      joi.object().keys({ public       :  joi.string().empty().min(1).default('/') }),
      joi.object().keys({ icons        :  joi.string().empty().min(1).default('/') }),
      joi.object().empty()
    ]),
    encrypt   : joi.object().default({ key : this.secretKey, type : 'hex' }).keys({
      key   : joi.string().default(this.secretKey).empty(),
      type  : joi.string().default('hex').valid([
        'ascii',
        'utf8',
        'utf16le',
        'ucs2',
        'base64',
        'binary',
        'hex'
      ])
    }),
    jwt       : joi.object().default({ enable : false, key : this.secretKey }).keys({
      enable : joi.boolean().default(false),
      key    : joi.string().default(this.secretKey)
    })
  };

  // default statement
  return schema;
};

// Default export
module.exports = new (ConfigExpressJs)();
