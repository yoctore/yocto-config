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

Back to [README](https://gitlab.com/yocto-node-modules/yocto-config/blob/master/README.md).