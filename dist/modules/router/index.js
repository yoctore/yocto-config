/* yocto-config - A simple config manager for node app - V1.6.5 */
"use strict";function ConfigRouter(){}var joi=require("joi");ConfigRouter.prototype.getSchema=function(){return joi.object().required().keys({routes:joi.string().required().empty()["default"](),controllers:joi.string().required().empty()["default"]()}).allow(["routes","controllers"])},module.exports=new ConfigRouter;