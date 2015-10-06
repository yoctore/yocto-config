/*function PassportJs (logger) {
  this.logger = logger;
}*/
/*
PassportJs.prototype.get = function() {

  var baseSchema = {
    identifier  : joi.string().required().empty().default(null),
    secret      : joi.string().required().empty(),
    urls        : joi.object().required().keys({
      connect   : joi.string().required().empty(),
      failure   : joi.string().required().empty(),
      success   : joi.string().required().empty()
    }),
    callback    : joi.string().required().empty(),

    fn          : joi.object().required().keys({
      connect   : joi.string().required().empty(),
      callback  : joi.string().required().empty()
    })
  };

  var facebookKeys = _.extend(baseSchema, {
    fields : joi.array().required().items(
      joi.string().valid([ 'id', 'name', 'gender', 'displayName',
                           'photos', 'emails', 'profileUrl'
                         ]);
    ),
  });




  var schema = joi.object().required().keys({
    facebook        : joi.object().keys({
      clientID          : joi.string().required().empty().default(null),
      clientSecret      : joi.string().required().empty(),
      callbackURL       : joi.string().required().empty(),
      profileFields     : joi.array().required().items(
        joi.string().valid([ 'id', 'name', 'gender',
                             'displayName', 'photos',
                             'emails', 'profileUrl'
                           ])
      ),
      url               : joi.string().required().empty(),
      connectFN         : joi.string().required().empty(),
      callbackSuccessFN : joi.string().required().empty(),
      failureRedirect   : joi.string().required().min(1)
    })
    twitter         : {},
    google          : {},
    activeDirectory : {},
    standard        : {}
  }).unknown()
}

AD & STD REMOVE SECRET

/**
var JOI_SCHEMA_FACEBOOK = joi.object().keys({


  callbackURL       : joi.string().required().min(1),
  profileFields     : joi.array().required().items(
    joi.string().valid('id', 'name', 'gender', 'displayName', 'photos', 'emails', 'profileUrl')
  ),

  connectFN         : joi.string().required().min(1),
  callbackSuccessFN : joi.string().required().min(1),

});

var JOI_SCHEMA_GOOGLE = joi.object().keys({


  callbackURL       : joi.string().required().min(1),

  connectFN         : joi.string().required().min(1),
  callbackSuccessFN : joi.string().required().min(1),

  scope             : joi.array().required()
});

var JOI_SCHEMA_TWITTER = joi.object().keys({


  callbackURL       : joi.string().required().min(1),

  connectFN         : joi.string().required().min(1),
  callbackSuccessFN : joi.string().required().min(1),

});

var JOI_SCHEMA_STANDARD = joi.object().keys({
  connectFN         : joi.string().required().min(1),

  callbackSuccessFN : joi.string().required().min(1),
  callbackFailFN    : joi.string().required().min(1)
});

var JOI_SCHEMA_ACTIVE_DIRECTORY = joi.object().keys({
  server            : joi.object().keys({
    bindDn             : joi.string().required().min(1),
    bindCredentials    : joi.string().required().min(1),
    url                : joi.string().required().min(1),
    searchBase         : joi.string().required().min(1),
    searchFilter       : joi.string().required().min(1)
  }),

  connectFN         : joi.string().required().min(1),
  callbackFN        : joi.string().required().min(1),

});




var JOI_SCHEMA_PARAMS_URL = joi.object().keys({
  callbackSuccess  : joi.string().required().min(1),
  callbackFail     : joi.string().required().min(1)
});

// Only for connect Standard
var JOI_SCHEMA_PARAM_URL = joi.object().keys({
  callbackSuccess : joi.string().required().min(1)
});
*/
