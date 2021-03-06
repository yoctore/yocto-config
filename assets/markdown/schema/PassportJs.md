## Default configuration rules : PassportJs

```javascript

// default schema
var baseSchema = {
  identifier  : joi.string().required().empty().default(null), // clientID
  secret      : joi.string().required().empty(), // sercet key
  urls        : joi.object().required().keys({
    connect   : joi.string().required().empty(), // init connection
    callback  : joi.string().required().empty()  // system callback url
  }),
  db          : joi.object().required().keys({
    method  : joi.string().required().empty()
  })
};

// facebook Keys definition
var facebookKeys = _.extend(_.clone(baseSchema), {
  fields : joi.array().required().items(
    joi.string().valid([ 'id', 'name', 'gender', 'displayName',
                         'photos', 'emails', 'profileUrl'
                       ])
  )
});

// twitter Keys definition
var twitterKeys         = _.clone(baseSchema);

// google Keys definition
var googleKeys          = _.extend(_.clone(baseSchema), {
  scope : joi.array().required().items(joi.string().required().empty()).min(1)
});

// Ad Keys definition
var activeDirectoryKeys = _.extend(_.omit(_.clone(baseSchema), [ 'identifier', 'secret' ]), {
  server : joi.object().required().keys({
    bindDn             : joi.string().required().empty(),
    bindCredentials    : joi.string().required().empty(),
    url                : joi.string().required().empty(),
    searchBase         : joi.string().required().empty(),
    searchFilter       : joi.string().required().empty()
  })
});

// standard auth
var standardAuthKeys =  _.omit(_.clone(baseSchema), [ 'identifier', 'secret', 'callback' ]);

// default schema
var schema = joi.object().required().keys({
  internalUrlRedirect : joi.string().required().empty(),
  facebook            : joi.object().optional().keys(facebookKeys),
  twitter             : joi.object().optional().keys(twitterKeys),
  google              : joi.object().optional().keys(googleKeys),
  activeDirectory     : joi.array().optional().items(activeDirectoryKeys),
  standard            : joi.array().optional().items(standardAuthKeys)
}).unknown();

```

Back to [README](https://gitlab.com/yocto-node-modules/yocto-config/blob/master/README.md).