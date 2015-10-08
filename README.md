## Overview

This module is a part of yocto node modules for NodeJS.

Please see [our NPM repository](https://www.npmjs.com/~yocto) for complete list of available tools (completed day after day).

This module provide a simple config validator tools for your node app.

## Motivation

Our main motivation for this module is, create and provide a single, simple and custom config manager (with validation) for each of our program.

## How validation schema works ?

Default validation schema was build with [joi](https://www.npmjs.com/package/joi) package manager, and all custom all schema must be associate with a **joi rules too**.

During load process given files was auto validated with associated schema.

## Config files priority

**Priority** : `(Other file).json` < `all.json` < `common.json` < `development.json` < `stagging.json` < `production.json`

all.json : place in this file all general property (shared key, node port, etc) 

common.json : place in this file all common data between each env (app name, express config, etc) 

development.json : place in this file all development property for development environnement

stagging.json : place in this file all stagging property for stagging environnement

production.json : place in this file all production property for production environnement

**IMPORTANT** : file was merged with previous defined priority, so it should be understood that we dont need to define multiple times the same property if we doesn't need to replace it.

*For example :* 

```javascript
// a development.json file with these property
{
"test" : {
  "db : {
    "uri" : "http://test.com/123456"
  }
}
```

```javascript
// a production.json file with these property
{
"test" : {
  "db : {
    "options" : {
        "op1" : "my-value1",
        "op2" : "my-value2"
    }
  }
}
```

Will produce on production this config data :
```javascript
// generated config in production env
{
"test" : {
  "db : {
    "uri" : "http://test.com/123456",
    "options" : {
        "op1" : "my-value1",
        "op2" : "my-value2"
    }
  }
}
```

## Pre-defined configuration

Predefined configuration schema was already defined. To use them see methods below : 

- enableExpress(complete) : add to default schema an express configuration
- enableMongoose(complete) : add to default schema a mongoose configuration
- enablePassportJs(complete) : add to default schema a passportjs configuration for (facebook, twitter, google, active-directory, standard login)

All of these function was replaced by default an already defined configuration.

If you want to enable a new configuration and keep safe the previous configuration, just pass `true` on enable function, for example :

```javascript
var config  = require('yocto-config')();

// defined base config
config.enableExpress();
// add new config ofr mongoose and keep safe previous defined config
config.enableMongoose(true); 
```

## Adding custom config schema

You can add your custom config schema for custom validation, two methods was available for these action : 

- addCustomSchema(name, schema, autoenable, keepSafePreviousSchema) : add new schema with given name
- enableSchema(name, keepSafePreviousSchema) : enable a schema with given name

Example :

```javascript
var config  = require('yocto-config')();
var joi     = require('joi');

// define your schema
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

// add custom schema named 'test'
// third parameter enable given schema (optional, by default to false)
// fourth parameter keep safe all predefined schema (optional, by default to false)
config.addCustomSchema('test', schema, true, true);

// OR classic process
config.addCustomSchema('test', schema);
config.enableSchema('test');
```

## How to use

```javascript

var config  = require('../src/index.js')();

// enable defined config
config.enableExpress(true);
config.enableMongoose(true);
config.enablePassportJs(true);

// Set config path
config.setConfigPath('./example/config');

// Load and retreive data from callback
config.load().then(function(data) {
  // your code here
  // you can also get data with a method
  var c = config.getConfig();
  console.log(c);
}).catch(function(error) {
  // your code here
});

```

## Default configuration rules : Express

```javascript
// default schema
{
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
      secret  : joi.string().empty().default('yocto-secret-key'),
      options : joi.object().default({
        path      : '/',
        expires   : new Date(),
        maxAge    : 0,
        domain    : null,
        secure    : true,
        httpOnly  : true
      }).keys({
        path      : joi.string().empty().optional().default('/'),
        expires   : joi.string().empty().optional().default(new Date()),
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
        secret            : joi.string().optional().min(8).default('yocto-secret-key'),
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
        secret  : 'yocto-secret-key'
      },
      csp           : {},
      xframe        : 'SAMEORIGIN',
      p3p           : '_p3p',
      hsts          : {},
      xssProtection : true
    }).keys({
      csrf          : joi.object().default({
        key     : '_csrf',
        secret  : 'yocto-secret-key'
      }).keys({
        key     : joi.string().empty().default('_csrf'),
        secret  : joi.string().empty().default('yocto-secret-key')
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
  encrypt   : joi.object().default({ key : 'yocto-secret-key', type : 'hex' }).keys({
    key   : joi.string().default('yocto-secret-key').empty(),
    type  : joi.string().default('hex').valid([
      'ascii',
      'utf8',
      'utf16le',
      'ucs2',
      'base64',
      'binary',
      'hex'
    ])
  })
};

```

## Default configuration rules : Mongoose

```javascript

// default schema
var schema = joi.object().required().keys({
  uri     : joi.string().required().empty(),
  options : joi.object().default({}).keys({
    db          : joi.object().optional().keys({
      serializeFunctions  : joi.boolean().default(false),
      raw                 : joi.boolean().default(false),
      retryMiliSeconds    : joi.number().min(0).default(5000),
      numberOfRetries     : joi.number().min(0).default(5),
      rs_name             : joi.string().required().empty().min(3)
    }),
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
    replset     : joi.object().optional().keys({
      rs_name : joi.string().required().empty().min(3)
    }),
    user        : joi.string().optional().empty(),
    pass        : joi.string().optional().empty()
  }).allow([ 'db', 'server', 'replset', 'user', 'pass' ])
});

```

## Logging in tool

By Default this module include [yocto-logger](https://www.npmjs.com/package/yocto-logger) for logging.
It's possible to inject in your mailer instance your current logger instance if is another `yocto-logger` instance.

## Changelog

All history is [here](https://gitlab.com/yocto-node-modules/yocto-config/blob/master/CHANGELOG.md)