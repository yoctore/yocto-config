/**
 * Unit tests
 */
var logger = require('yocto-logger');
logger.enableConsole(false);
var config = require('../src/index.js')(logger);
var assert = require('chai').assert;
var should = require('chai').should;
var util   = require('util');



// start unit tests
describe('Config()', function() {

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
    var paths = [
      './example/config',
      '/Users/yocto/Documents/Yocto/projets/yocto-node-modules/yocto-config/example/config'
    ];
    
    paths.forEach(function(path) {
      it('Using path on current config : ' + util.inspect(path, { depth : null }), function() {    
        config.set('base', path);
        config.load().then(function(success) {
          success.should.be.an('object');
        }).catch(function(error) {
          should.not.exist(error);
        });
      });
    });
  });
});