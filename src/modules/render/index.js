'use strict';

var joi   = require('joi');

/**
 * Yocto render Schema
 *
 * @date : 07/10/2015
 * @author : ROBERT Mathieu <mathieu@yocto.re>
 * @copyright : Yocto SAS, All right reserved
 * @class ConfigRender
 */
function ConfigRender () {}

/**
 * Return current Render schema defintion
 *
 * @return {Object} default schema for passport configuration
 */
ConfigRender.prototype.getSchema = function () {
  // define meta rules
  var metaHttpEquivRules = joi.object().keys({
    name  : joi.string().required().not(null),
    value : joi.string().required().not(null)
  });

  // setting css media rules
  var cssMediaRules = joi.object().keys({
    link  : joi.string().required().not(null),
    media : joi.string().required().not(null),
    defer : joi.string().optional().allow('defer').not(null),
    async : joi.string().optional().allow('async').not(null),
  });

  // setting js media rules
  var jsMediaRules = joi.object().keys({
    link  : joi.string().required().not(null),
    defer : joi.string().optional().allow('defer').not(null),
    async : joi.string().optional().allow('async').not(null)
  });

  // setting up media type rules
  var mediaTypeRules = {
    css : joi.array().optional().min(1).items(cssMediaRules),
    js  : joi.array().optional().min(1).items(jsMediaRules)
  };

  // setting up assets rules
  var assetsRules = {
    header : joi.object().optional().min(1).keys(mediaTypeRules),
    footer : joi.object().optional().min(1).keys(mediaTypeRules)
  };

  // default statement
  return joi.object().required().keys({
    app     : joi.object().optional().min(1).keys({
      name : joi.string().required().min(3).not(null).empty()
    }),

    render  : joi.object().optional().min(1).keys({
      title     : joi.string().optional().min(3).not(null),
      language  : joi.string().optional().length(2).not(null),
      meta      : joi.array().optional().min(1).items(metaHttpEquivRules),
      httpEquiv : joi.array().optional().min(1).items(metaHttpEquivRules),
      assets    : joi.object().optional().min(1).keys(assetsRules)
    })
  });
};

// Default export
module.exports = new (ConfigRender)();