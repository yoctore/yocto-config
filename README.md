[![NPM](https://nodei.co/npm/yocto-config.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/yocto-config/)

![alt text](https://david-dm.org/yoctore/yocto-config.svg "Dependencies Status")
[![Code Climate](https://codeclimate.com/github/yoctore/yocto-config/badges/gpa.svg)](https://codeclimate.com/github/yoctore/yocto-config)
[![Test Coverage](https://codeclimate.com/github/yoctore/yocto-config/badges/coverage.svg)](https://codeclimate.com/github/yoctore/yocto-config/coverage)
[![Issue Count](https://codeclimate.com/github/yoctore/yocto-config/badges/issue_count.svg)](https://codeclimate.com/github/yoctore/yocto-config)
[![Build Status](https://travis-ci.org/yoctore/yocto-config.svg?branch=master)](https://travis-ci.org/yoctore/yocto-config)

## Overview

This module is a part of yocto node modules for NodeJS.

Please see [our NPM repository](https://www.npmjs.com/~yocto) for complete list of available tools (completed day after day).

This module provide a simple config validator tools for a node app.

## Motivation

Our main motivation for this module is, create and provide a single, simple and custom config manager (with validation) for each part of our program in the same place.

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

**IMPORTANT** : file was merged with previous defined priority, so it should be understood that we dont need to define multiple times the same property if we doesn't need to replace it. **JUST PLACE IN CORRECT ENV WHAT YOU NEED**

*For example :* 

```javascript
// a development.json file with these property
{
"test" : {
  "db" : {
    "uri" : "http://test.com/123456"
  }
}
```

```javascript
// a production.json file with these property
{
"test" : {
  "db" : {
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
  "db" : {
    "uri" : "http://test.com/123456",
    "options" : {
        "op1" : "my-value1",
        "op2" : "my-value2"
    }
  }
}
```

## Pre-defined configuration

Predefined configuration schema was availabe. To use them see methods below : 

- [enableExpress]() : add to default schema an express configuration
- [enableMongoose]() : add to default schema a mongoose configuration
- [enablePassportJs]() : add to default schema a passportjs configuration for (facebook, twitter, google, active-directory, standard login)
- [enableRender]() : add to default schema a [yocto-render](https://www.npmjs.com/package/yocto-render) configuration
- [enableRouter]() : add to default schema a [yocto-router](https://www.npmjs.com/package/yocto-router) configuration

All of these function was replaced by default an already defined configuration.

If you want to enable a new configuration and keep safe the previous configuration, just pass `true` on enable function, and the new config will be append on the previous content, for example :

```javascript
var config  = require('yocto-config')();

// defined base config
config.enableExpress();
// add new config for mongoose and keep safe previous defined config
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

var config  = require('yocto-config')();

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

## How to change config on the fly ?

In some case we need to use same core app for different apps. 
To change the config path for each app during run it's possible to use `process.env`.
To use it run during start your app use these params `CONFIG_SUFFIX_PATH`.

```bash
CONFIG_SUFFIX_PATH='suffix/base/path' node app
```

## Tricks

You can also use a utility method `autoEnableValidators` to enable your validator. See below key associated with schema : 

- `express` for express schema
- `passportJs` for passportJs schema
- `mongoose` for mongoose schema
- `render` for yocto-render module schema
- `router` for yocto-router module schema

Example : 

```javascript
var config  = require('yocto-config')();
config.autoEnableValidators([ 'express', 'passportJs', 'mongoose' ]);
// Extra process
```

## Default configuration rules

- Mongoose schema can be find [here](https://yoctore.github.io/yocto-config/schema.js.html#line741)
- Express schema can be find [here](https://yoctore.github.io/yocto-config/schema.js.html#line383)
- Yocto Render schema can be find [here](https://yoctore.github.io/yocto-config/schema.js.html#line869)
- Yocto Router schema can be find [here](https://yoctore.github.io/yocto-config/schema.js.html#line966)
- Yocto PassportJS schema can be find [here](https://yoctore.github.io/yocto-config/schema.js.html#line805)

## Logging in tool

By Default this module include [yocto-logger](https://www.npmjs.com/package/yocto-logger) for logging.
It's possible to inject in your config instance your current logger instance if is another `yocto-logger` instance.

## Changelog

All history is [here](https://github.com/yoctore/yocto-config/blob/master/CHANGELOG.md)

## Full Documenation

You can find full online documentation [here](https://yoctore.github.io/yocto-config)