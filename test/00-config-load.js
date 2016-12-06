/**
 * Unit tests
 */
var logger = require('yocto-logger');
var config = require('../src/index.js')(logger);
var assert = require('chai').assert;
var should = require('chai').should;
var util   = require('util');
var expect = require('chai').expect;
var _      = require('lodash');

logger.enableConsole(false);

// start unit tests
describe('Config()', function() {

  var paths = [
    {
      path  : './example/config',
      rules : [
        { property : 'env', type : 'String', eq : 'development', group : 'app' },
        { property : 'port', type : 'Number', eq : 3000, group : 'app' },
        { property : 'directory', type : 'Array', eq : [ 
          { models: './my/path/to/models' },
          { controllers: './my/path/to/controllers' },
          { views: './my/path/to/views' },
          { public: './my/path/to/public' },
          { icons: './my/path/to/public/icons' },
          { test: '/test' }
        ], group : 'app' },
        // Express
        { property : 'encrypt_key', type : 'Object', eq : { key: '6e67ae372ad6d85cfad1abc366823e28', type: 'hex' }, group : 'app' },
        { property : 'app', type : 'Object', eq : { name: 'my AP DEV', session: { timeout: 30 }, stackError: true }, group : 'app'
        },
        { property : 'express.json', type : 'Object', eq : { inflate: true, limit: '100kb', strict : true, type: 'json' }, group : 'express' },
        { property : 'express.urlencoded', type : 'Object', eq : {
            extended: false, inflate: true, limit: '100kb', parameterLimit: 1000,
            type: 'urlencoded' }, group : 'express' },
        { property : 'express.cookieParser', type : 'Object', eq : {
          enable: true, secret: 'yocto-secret-key', options : { 
            path: '/',
            expires: 'Tue Dec 06 2016 00:52:56 GMT+0400 (RET)',
            maxAge: 0,
            domain: null,
            secure: true,
            httpOnly: true
          }, group : 'express' }
        },
        { property : 'express.jsonp', type : 'Boolean', eq : false, group : 'express' },
        { property : 'express.prettyHtml', type : 'Boolean', eq : true, group : 'express' },
        { property : 'express.filter', type : 'Object', eq : {
          rules : 'json|text|javascript|css|html',
          by    : 'Content-Type',
          level : 9 
        }, group : 'express' },
        { property : 'express.viewEngine', type : 'String', eq : 'jade', group : 'express' },
        { property : 'express.session', type : 'Object', eq : { options :
         { cookie: 
            { path: '/',
              httpOnly: false,
              secure: true,
              maxAge: null,
              domain: null },
           store: { instance: 'mongo', uri: 'fsd', type: 'uri' },
           secret: 'yocto-secret-key',
           name: 'connect.sid',
           genuuid: false,
           resave: false,
           saveUninitialized: true,
           rolling: false },
        enable: true }, group : 'express' },
        { property : 'express.vhost.enable', type : 'Boolean', eq : true, group : 'express' },
        { property : 'express.vhost.options', type : 'Object', eq : { 
          url: 'myhosturl.url',
          aliases: [ 'alias.myhosturl.url' ],
          subdomains: true,
          http: { redirect: { type: 301, url: 'www.myurl.url', port: 80 } } }, group : 'express' },
        { property : 'express.security.enable', type : 'Boolean', eq : false, group : 'express' },
        { property : 'express.security.xframe', type : 'String', eq : 'ALLOW-FROM http://www.yocto.re', group : 'express' },
        { property : 'express.security.csrf' , type : 'Object', eq : { key: '_csrf', secret: 'yocto-secret-key', angular: true }, group : 'express' },
        { property : 'express.security.csp.policy', type : 'Object', eq : {
            'default-src': 'none',
            'script-src': '\'self\'',
            'object-src': '\'self\'',
            'style-src': '\'self\'',
            'img-src': '\'self\'',
            'media-src': '\'self\'',
            'child-src': '\'self\'',
            'font-src': '\'self\'',
            'connect-src': '\'self\'',
            'form-action': '\'self\'',
            'script-nonce': '\'self\'',
            'plugin-types': '\'self\'',
            'reflected-xss': '\'self\'',
            'report-uri': '\'self\'' }, group : 'express'
          },
          { property : 'express.security.csp.reportOnly', type : 'Boolean', eq : false, group : 'express' },
          { property : 'express.security.p3p', type : 'String', eq : '_p3p', group : 'express' },
          { property : 'express.security.hsts', type : 'Object', eq : {
             maxAge: 0, includeSubDomains: true, preload: true }, group : 'express'
          },
          { property : 'express.security.xssProtection', type : 'Boolean', eq : true, group : 'express' },
          { property : 'express.security.nosniff', type : 'Boolean', eq : true, group : 'express' },
          { property : 'express.methodOverride', type : 'Array', eq : [ '_method' ], group : 'express' },
          { property : 'express.multipart', type : 'Boolean', eq : false, group : 'express' },
          // passportJs
          { property : 'passportJs.internalUrlRedirect', type : 'String', eq : '/toto', group : 'passportJs' },
          { property : 'passportJs.facebook', type : 'Object', eq : { 
            identifier: 'fsddfs',
            secret: 'fdsfsdfd',
            urls: { connect: 'fsdfds', callback: 'fsdfds' },
            db: { method: 'fsdfds' },
            fields: [] }, group : 'passportJs' 
          },
          { property : 'passportJs.twitter', type : 'Object', eq : {
            identifier: 'fsddfs',
            secret: 'fdsfsdfd',
            urls: { connect: 'fsdfds', callback: 'fsdfds' },
            db: { method: 'fsdfds' } }, group : 'passportJs' 
          },
          { property : 'passportJs.google', type : 'Object', eq : {
            identifier: 'fsddfs',
            secret: 'fdsfsdfd',
            urls: { connect: 'fsdfds', callback: 'fsdfds' },
            db: { method: 'fsdfds' },
            scope: [ 'fdfsdfdfsdfd' ] }, group : 'passportJs' 
          },
          { property : 'passportJs.activeDirectory', type : 'Array', eq : [
            { urls: { connect: 'fsdfds', callback: 'fsdfds' },
            server: 
             { bindDn: 'toto',
               bindCredentials: 'dqsds',
               url: 'ddqsdqsdsq myurl',
               searchBase: 'fsdfdsfds',
               searchFilter: 'fsdfdsfds' },
            db: { method: 'fsdfds' } } ], group : 'passportJs' 
          },
          { property : 'passportJs.standard', type : 'Array', eq : [
            { urls: { connect: 'fsdfds', callback: 'fsdfds' },
            db: { method: 'fsdfdsfds' } } ], group : 'passportJs' 
          },
          // render
          { property : 'render.property.mobileIcons', type : 'Array', eq : [
            { rel: 'a', sizes: 'fsdfsd', href: 'fsdfds' } ], group : 'render' 
          },
          { property : 'render.property.social.facebook', type : 'Array', eq : [
            { property: 'fdsfsd', content: 'fsdfds' } ], group : 'render' 
          },
          { property : 'render.property.social.google', type : 'Array', eq : [
            { rel: 'fdsfsd', href: 'fsdfds' } ], group : 'render' 
          },
          { property : 'render.property.social.twitter', type : 'Array', eq : [],
            group : 'render' 
          },
          // router
          { property : 'router.routes', type : 'String', eq : './routes', group : 'router' },
          { property : 'router.controllers', type : 'String', eq : './controllers', group : 'router' },
          // mongoose
          { property : 'db.uri', type : 'String', eq : 'localhost:27051', group : 'mongoose' },
          { property : 'db.type', type : 'String', eq : 'mongoose', group : 'mongoose' },
          { property : 'db.options', type : 'Object', eq : {}, group : 'mongoose' },
          // protocol
          { property : 'protocol.type', type : 'String', eq : 'http', group : 'protocol' },
          { property : 'protocol.certificate', type : 'Object', eq : { 
            key: './toto/fsdfsddf', cert: './toto/fdsfdsfd' }, group : 'protocol' },
          { property : 'protocol.port', type : 'Number', eq : 3000, group : 'protocol' },
          // jwt
          { property : 'jwt.enable', type : 'Boolean', eq : true, group : 'jwt' },
          { property : 'jwt.key', type : 'String', eq : 'EZEAZEZAEZA', group : 'jwt' },
          { property : 'jwt.ips', type : 'Array', eq : [ 
            '127.0.0.1', '127.0.0.1/26' ], group : 'jwt' },
          { property : 'jwt.allowedRoutes', type : 'Array', eq : [ 
            '/auth/connect/' ], group : 'protocol' },
          { property : 'jwt.autoEncryptRequest', type : 'Boolean', eq : true, group : 'jwt' },
          { property : 'jwt.autoDecryptRequest', type : 'Boolean', eq : true, group : 'jwt' },
          // cors
          { property : 'cors', type : 'Boolean', eq : true, group : 'cors' },
          { property : 'corsCfg.origin', type : 'Array', eq : [ 'toto' ], group : 'cors' },
          { property : 'corsCfg.methods', type : 'Array', eq : [ 'GET', 'PATCH' ], group : 'cors' },
          { property : 'corsCfg.allowedHeaders', type : 'Array', eq : [ 'fdsfds' ], group : 'cors' },
          { property : 'corsCfg.exposedHeaders', type : 'Array', eq : [ 
            'fsdfdsfds' ], group : 'cors' },
          { property : 'corsCfg.credentials', type : 'Boolean', eq : false, group : 'cors' },
          { property : 'corsCfg.maxAge', type : 'Number', eq : 202002, group : 'cors' },
          { property : 'corsCfg.preflightContinue', type : 'Boolean', eq : false, group : 'cors' },
          // redirect
          { property : 'redirect.www', type : 'Boolean', eq : true, group : 'redirect' },
          { property : 'redirect.seo', type : 'Array', eq : [ { 
            code: 301,
            fromUrl: 'fdfdfdfd',
            toUrl: 'trrrere',
            queryString: false } ], group : 'redirect' }
      ],
      result : {}
    }
  ];


  describe('load() must Invalid with invalid config path', function() {    
    var paths = [
      './example/myinvlidpath',
      './example/myinvlidpath2',
      './example/myinvlidpath4',
      '../example/config',
      '/Users/yocto/Documents/Yocto/projets/yocto-node-modules/yocto-config/example/configeeee'
    ];
    
    paths.forEach(function(path) {
      it('Using path on current config : ' + util.inspect(path, { depth : null }), function() {    
        config.set('base', path);
        config.load().then(function(success) {
          should.not.exist(success);
        }).catch(function(error) {
          error.should.be.an('string');
        });
      });
    });
  });

  describe('load() must OK with a valid config path AND valid config file', function() {    
    paths.forEach(function(path, index) {
      it('Using path on current config : ' + util.inspect(path.path, { depth : null }), function() {    
        config.set('base', path.path);
        config.autoEnableValidators([ 'express', 'test', 'passportJs', 'passport', 'mongoose', 'render','router' ]);
        config.load().then(function(success) {
          paths[index].result = success;
          success.should.be.an('object');
        }).catch(function(error) {
          should.not.exist(error);
        });
      });
    });
  });

  describe('[ App ] - Schema & get value must be OK after loading', function() {
    paths.forEach(function(path) {
      path.rules.forEach(function (rule) {
        if (rule.group === 'app') {
          it( 'property [' + rule.property + '] must be an [' + rule.type + '] and equal to '
            + util.inspect(rule.eq, { depth : null }), function() {
              var v = _.get(path.result, rule.property);
              expect(v).to.be.an(rule.type).to.deep.equal(rule.eq);
          });
        }
      });
    });
  });

  describe('[ Express ] - Schema & get value must be OK after loading', function() {
    paths.forEach(function(path) {
      path.rules.forEach(function (rule) {
        if (rule.group === 'express') {
          it( 'property [' + rule.property + '] must be an [' + rule.type + '] and equal to '
            + util.inspect(rule.eq, { depth : null }), function() {
              var v = _.get(path.result, rule.property);
              if (rule.property === 'express.cookieParser') {
                v.options.expires =  'Tue Dec 06 2016 00:52:56 GMT+0400 (RET)';
              }
              expect(v).to.be.an(rule.type).to.deep.equal(rule.eq);
          });
        }
      });
    });
  });

  describe('[ PassportJs ] - Schema & get value for must be OK after loading', function() {
    paths.forEach(function(path) {
      path.rules.forEach(function (rule) {
        if (rule.group === 'passportJs') {
          it( 'property [' + rule.property + '] must be an [' + rule.type + '] and equal to '
            + util.inspect(rule.eq, { depth : null }), function() {
              var v = _.get(path.result, rule.property);
              expect(v).to.be.an(rule.type).to.deep.equal(rule.eq);
          });
        }
      });
    });
  });

  describe('[ Mongoose ] - Schema & get value must be OK after loading', function() {
    paths.forEach(function(path) {
      path.rules.forEach(function (rule) {
        if (rule.group === 'mongoose') {
          it( 'property [' + rule.property + '] must be an [' + rule.type + '] and equal to '
            + util.inspect(rule.eq, { depth : null }), function() {
              var v = _.get(path.result, rule.property);
              expect(v).to.be.an(rule.type).to.deep.equal(rule.eq);
          });
        }
      });
    });
  });

  describe('[ Render ] - Schema & get value  must be OK after loading', function() {
    paths.forEach(function(path) {
      path.rules.forEach(function (rule) {
        if (rule.group === 'render') {
          it( 'property [' + rule.property + '] must be an [' + rule.type + '] and equal to '
            + util.inspect(rule.eq, { depth : null }), function() {
              var v = _.get(path.result, rule.property);
              expect(v).to.be.an(rule.type).to.deep.equal(rule.eq);
          });
        }
      });
    });
  });

  describe('[ Router ] Schema & get value must be OK after loading', function() {
    paths.forEach(function(path) {
      path.rules.forEach(function (rule) {
        if (rule.group === 'router') {
          it( 'property [' + rule.property + '] must be an [' + rule.type + '] and equal to '
            + util.inspect(rule.eq, { depth : null }), function() {
              var v = _.get(path.result, rule.property);
              expect(v).to.be.an(rule.type).to.deep.equal(rule.eq);
          });
        }
      });
    });
  });

  describe('[ Protocol ] Schema & get value must be OK after loading', function() {
    paths.forEach(function(path) {
      path.rules.forEach(function (rule) {
        if (rule.group === 'protocol') {
          it( 'property [' + rule.property + '] must be an [' + rule.type + '] and equal to '
            + util.inspect(rule.eq, { depth : null }), function() {
              var v = _.get(path.result, rule.property);
              expect(v).to.be.an(rule.type).to.deep.equal(rule.eq);
          });
        }
      });
    });
  });

  describe('[ Jwt ] Schema & get value must be OK after loading', function() {
    paths.forEach(function(path) {
      path.rules.forEach(function (rule) {
        if (rule.group === 'jwt') {
          it( 'property [' + rule.property + '] must be an [' + rule.type + '] and equal to '
            + util.inspect(rule.eq, { depth : null }), function() {
              var v = _.get(path.result, rule.property);
              expect(v).to.be.an(rule.type).to.deep.equal(rule.eq);
          });
        }
      });
    });
  });

  describe('[ Cors ] Schema & get value must be OK after loading', function() {
    paths.forEach(function(path) {
      path.rules.forEach(function (rule) {
        if (rule.group === 'cors') {
          it( 'property [' + rule.property + '] must be an [' + rule.type + '] and equal to '
            + util.inspect(rule.eq, { depth : null }), function() {
              var v = _.get(path.result, rule.property);
              expect(v).to.be.an(rule.type).to.deep.equal(rule.eq);
          });
        }
      });
    });
  });

  describe('[ Redirect ] Schema & get value must be OK after loading', function() {
    paths.forEach(function(path) {
      path.rules.forEach(function (rule) {
        if (rule.group === 'redirect') {
          it( 'property [' + rule.property + '] must be an [' + rule.type + '] and equal to '
            + util.inspect(rule.eq, { depth : null }), function() {
              var v = _.get(path.result, rule.property);
              expect(v).to.be.an(rule.type).to.deep.equal(rule.eq);
          });
        }
      });
    });
  });
});