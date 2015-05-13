# Yocto Config

Manage your configuration file (all / common / env  & specific file) for an project based on yocto-stack generator

## File priority 

Config file has priority. And priority is defined like a php.ini system.

```pre
(Other file).json < all.json < common.json < development.json < staging.json < production.json
```

```javascript
// all.json
{
 "allA" : 1
 "allB" : 2
}

// common.json
{
 "commonA" : 3
 "commonB" : 4
}

// development.json
{
 "devA" : 5
 "devB" : 6
}


// staging.json
{
 "devA" : 7
 "devB" : 8
}

// prodution.json
{
 "devA" : 9
 "devB" : 10
}
```

If we merge data for *development* envrionement we get this output : 

```javascript
// all.json +  common.json + development.json
{
 "allA" : 1
 "allB" : 2
 "commonA" : 3
 "commonB" : 4
 "devA" : 5
 "devB" : 6
}
```

If we merge data for *staging* envrionement we get this output : 

```javascript
// all.json +  common.json + development.json + staging.json
{
 "allA" : 1
 "allB" : 2
 "commonA" : 3
 "commonB" : 4
 "devA" : 7
 "devB" : 8
}

// dev value are changed by staging data
```

If we merge data for *production* envrionement we get this output : 

```javascript
// all.json +  common.json + development.json + staging.json + production.json
{
 "allA" : 1
 "allB" : 2
 "commonA" : 3
 "commonB" : 4
 "devA" : 9
 "devB" : 10
}

// staging value are changed by production data
```

*All other specific files are added on begining of merge. if a specific configuration are needed and default key used, please read schema validation for default value beacause default schema will be replace your key if is default key*

## Default validation schema

*Schema is based on joi package : https://github.com/hapijs/joi*

```javascript 
joi.object().min(1).keys({
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
    }).unknown(true)
```


## Config files 

All specific data must be configured on a each correct file.

* all.json : contains general data (special keys, app name, etc) => not env data
* common.json : must containt all common data between each env
* development.json : must contains development data for development environnement
* staging.json : must contains stagging data for staging environnement
* production.json : must contains production data for production environnement 

## Dependencies 

For more details on these dependencies read links below :
- yocto-logger : lab.yocto.digital:yocto-node-modules/yocto-logger.git
- Lodash : https://lodash.com/
- path : https://nodejs.org/api/path.html
- joi : https://github.com/hapijs/joi
- fs : https://nodejs.org/api/fs.html
- glob : https://www.npmjs.com/package/glob

## Usage 

```javascript

// # 1 . Create your config directory
// # 2 . Edit all your config file (all - common - dev - staging - production) json file
// # 3 . See usage below : 

var config = require('yocto-config');

// For relative path
config.set('base', './example/config');
config.load();

// For absolute path
config.set('base', '/your/path/my/project/example/config');
config.load();
```
