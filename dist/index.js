/* yocto-config - A simple config manager for node app - V1.7.1 */
"use strict";function Config(a){this.config={},this.state=!1,this.env=process.env.NODE_ENV||"development",this.base=process.cwd(),this.logger=a,this.schemaList={express:configExpress.getSchema(),mongoose:configMongoose.getSchema(),passportJs:configPassport.getSchema(),render:configRender.getSchema(),router:configRouter.getSchema()},this.schema={}}var path=require("path"),_=require("lodash"),logger=require("yocto-logger"),joi=require("joi"),fs=require("fs"),glob=require("glob"),utils=require("yocto-utils"),Q=require("q"),configExpress=require("./modules/express"),configMongoose=require("./modules/mongoose"),configPassport=require("./modules/passportjs"),configRender=require("./modules/render"),configRouter=require("./modules/router");Config.prototype.find=function(a,b){this.logger.debug(["[ Config.find ] - Try to enable config for",a].join(" "));var c=_.has(this.schemaList,a);if(c){c=this.schemaList[a];var d=_.set({},a,c);return"express"===a&&_.has(d,"express")&&(d=d.express),"mongoose"!==a&&"sequelize"!==a||(d={db:d[a]}),_.isBoolean(b)&&b?_.merge(this.schema,d):this.schema=d,this.logger.info(["[ Config.find ] -",a,"config was correcty activated."].join(" ")),!0}return!1},Config.prototype.enableExpress=function(a){return a=_.isBoolean(a)?a:!1,this.enableSchema("express",a)},Config.prototype.enableRender=function(a){return a=_.isBoolean(a)?a:!1,this.enableSchema("render",a)},Config.prototype.enableRouter=function(a){return a=_.isBoolean(a)?a:!1,this.enableSchema("router",a)},Config.prototype.enableMongoose=function(a){return a=_.isBoolean(a)?a:!1,this.enableSchema("mongoose",a)},Config.prototype.enablePassportJs=function(a){return a=_.isBoolean(a)?a:!1,this.enableSchema("passportJs",a)},Config.prototype.enableSchema=function(a,b){return b=_.isBoolean(b)?b:!1,this.find(a,b)},Config.prototype.addCustomSchema=function(a,b,c,d){return _.has(this.schemaList,a)||!_.isObject(b)?(this.logger.error(["[ Config.addCustomerSchema ] - Cannot add new custom schema. Schema :",a,"already exist, or given value is invalid."].join(" ")),!1):(_.extend(this.schemaList,_.set({},a,b)),_.isBoolean(c)&&c?this.enableSchema(a,d):_.has(this.schemaList,a))},Config.prototype.set=function(a,b){return _.isUndefined(a)||!_.isString(a)||_.isEmpty(a)?(this.logger.warning(["[ Core.set ] - Invalid value given.","name must be a string and not empty. Operation aborted !"].join(" ")),!1):("base"===a&&(path.isAbsolute(b)||(b=path.normalize([process.cwd(),b].join("/")))),this[a]=b,!0)},Config.prototype.getConfig=function(){return this.get("config")},Config.prototype.setConfigPath=function(a){return this.set("base",a)},Config.prototype.get=function(a){return this[a]},Config.prototype.reload=function(a){return _.isString(a)&&!_.isEmpty(a)&&(this.base=a),this.load()},Config.prototype.loadPassport=function(){return this.load()},Config.prototype.autoEnableValidators=function(a){return!_.isArray(a)||_.isEmpty(a)?(this.logger.warning(["[ Config.autoEnableValidator ] - Cannot check items.","Is not an array or is empty."].join(" ")),!1):(_.each(a,function(a){_.has(this.schemaList,a)?this.enableSchema(a,!0)||this.logger.error(["[ Config.autoEnableValidator ] - Auto enable [",a,"] failed"].join(" ")):this.logger.warning(["[ Config.autoEnableValidator ] - Cannot enable [",a,"] schema does not exists"].join(" "))},this),!0)},Config.prototype.load=function(){var a=Q.defer();try{var b={},c=path.normalize([this.base,"*.json"].join("/")),d=path.normalize([this.base,[this.env,".json"].join("")].join("/")),e=glob.sync(c);if(_.isEmpty(e))throw"No files was found. operation aborted !";e=_.sortBy(e,function(a){var b=path.normalize([this.base,"all.json"].join("/")),c=path.normalize([this.base,"common.json"].join("/")),d=path.normalize([this.base,"development.json"].join("/")),e=path.normalize([this.base,"staging.json"].join("/")),f=path.normalize([this.base,"production.json"].join("/"));return[a===f,a===e,a===d,a===c,a===b,a===a].join("|")},this),_.each(e,function(a){var c=JSON.parse(fs.readFileSync(a,"utf-8"));return _.merge(b,c),d!==a}),this.schema=joi.object().required().keys(this.schema).unknown(!0);var f=joi.validate(b,this.schema,{abortEarly:!1});if(!_.isNull(f.error))throw _.each(f.error.details,function(a){this.logger.warning(["[ Config.load ] - Cannot update config an error occured. Error is :",utils.obj.inspect(a)].join(" "))},this),"Config validation failed";_.each(b.directory,function(a){var b=_.first(_.values(a));path.isAbsolute(b)||(b=path.normalize([process.cwd(),b].join("/")));var c=[_.first(_.keys(a)),"directory"].join("_").toUpperCase();this[c]=b},this),this.state=!0,this.config=f.value,this.logger.info(["[ Config.load ] - Success - Config file was changed with files based on :",this.base].join(" ")),a.resolve(this.config)}catch(g){this.logger.error(["[ Config.load ] - an error occured during load config file. Error is :",g].join(" ")),a.reject(g)}return a.promise},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning("[ Config.constructor ] - Invalid logger given. Use internal logger"),a=logger),new Config(a)};