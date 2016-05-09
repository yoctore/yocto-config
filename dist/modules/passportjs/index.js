/* yocto-config - A simple config manager for node app - V1.7.1 */
"use strict";function ConfigPassportJs(){}var joi=require("joi"),_=require("lodash");ConfigPassportJs.prototype.getSchema=function(){var a={identifier:joi.string().required().empty()["default"](null),secret:joi.string().required().empty(),urls:joi.object().required().keys({connect:joi.string().required().empty(),callback:joi.string().required().empty()}),db:joi.object().required().keys({method:joi.string().required().empty()})},b=_.extend(_.clone(a),{fields:joi.array().required().items(joi.string().valid(["id","name","gender","displayName","photos","emails","profileUrl"]))}),c=_.clone(a),d=_.extend(_.clone(a),{scope:joi.array().required().items(joi.string().required().empty()).min(1)}),e=_.extend(_.omit(_.clone(a),["identifier","secret"]),{server:joi.object().required().keys({bindDn:joi.string().required().empty(),bindCredentials:joi.string().required().empty(),url:joi.string().required().empty(),searchBase:joi.string().required().empty(),searchFilter:joi.string().required().empty()})}),f=_.omit(_.clone(a),["identifier","secret","callback"]),g=joi.object().required().keys({internalUrlRedirect:joi.string().required().empty(),facebook:joi.object().optional().keys(b),twitter:joi.object().optional().keys(c),google:joi.object().optional().keys(d),activeDirectory:joi.array().optional().items(e),standard:joi.array().optional().items(f)}).unknown();return g},module.exports=new ConfigPassportJs;