/**
 * Unit tests
 */
var config = require('../src/index.js');
var assert = require('assert');
var util   = require('util');

config.logger.enableConsole(false);

// start unit tests
describe('Config()', function() {

  describe('load() must return false with invalid config path', function() {    
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
        assert.equal(config.load(), false);      
      });
    });
  });

  describe('load() must return true with a valid config path AND valid config file', function() {    
    var paths = [
      './example/config',
      '/Users/yocto/Documents/Yocto/projets/yocto-node-modules/yocto-config/example/config'
    ];
    
    paths.forEach(function(path) {
      it('Using path on current config : ' + util.inspect(path, { depth : null }), function() {    
        config.set('base', path);
        assert.equal(config.load(), true);      
      });
    });
  });

  describe('load() must return false with an invalid config file', function() {    
    var paths = [
      '/Users/yocto/Documents/Yocto/projets/yocto-node-modules/yocto-config/example/invalid-config'
    ];
    
    paths.forEach(function(path) {
      it('Using path on current config : ' + util.inspect(path, { depth : null }), function() {    
        config.set('base', path);
        assert.equal(config.load(), false);      
      });
    });
  });

});