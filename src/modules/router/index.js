'use strict';

var joi   = require('joi');

/**
 * Yocto router Schema
 *
 * @date : 07/10/2015
 * @author : ROBERT Mathieu <mathieu@yocto.re>
 * @copyright : Yocto SAS, All right reserved
 * @class ConfigRouter
 */
function ConfigRouter () {}

/**
 * Return current router schema defintion
 *
 * @return {Object} default schema for passport configuration
 */
ConfigRouter.prototype.getSchema = function () {
  // default statement
  return joi.object().required().keys({
    routes      : joi.string().required().empty().default(),
    controllers : joi.string().required().empty().default()
  }).allow([ 'routes', 'controllers' ]);
};

// Default export
module.exports = new (ConfigRouter)();
