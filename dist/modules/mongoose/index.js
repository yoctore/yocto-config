/* yocto-config - A simple config manager for node app - V1.0.2 */
function ConfigMongoose(){}var joi=require("joi"),_=require("lodash"),utils=require("yocto-utils");ConfigMongoose.prototype.getSchema=function(){var a={nativeParser:joi["boolean"]()["default"](!1)},b={rsName:joi.string().required().empty().min(3)},c=_.extend({serializeFunctions:joi["boolean"]()["default"](!1),raw:joi["boolean"]()["default"](!1),retryMiliSeconds:joi.number().min(0)["default"](5e3),numberOfRetries:joi.number().min(0)["default"](5)},utils.obj.underscoreKeys(a)),d=joi.object().required().keys({uri:joi.string().required().empty(),options:joi.object()["default"]({}).keys({db:joi.object().optional().keys(c),server:joi.object().optional().keys({poolSize:joi.number().min(5)["default"](5),ssl:joi["boolean"]()["default"](!1),sslValidate:joi["boolean"]()["default"](!0),sslCA:joi.array()["default"](null),sslCert:joi.string()["default"](null),sslKey:joi.string()["default"](null),sslPass:joi.string()["default"](null),autoReconnect:joi["boolean"]()["default"](!0),socketOptions:joi.object()["default"]({noDelay:!0,keepAlive:0,connectTimeoutMS:0,socketTimeoutMS:0}).keys({noDelay:joi["boolean"]()["default"](!0),keepAlive:joi.number().min(0)["default"](0),connectTimeoutMS:joi.number().min(0)["default"](0),socketTimeoutMS:joi.number().min(0)["default"](0)}).allow(["noDelay","keepAlive","connectTimeoutMS","socketTimeoutMS"])}).allow(["poolSize","ssl","sslValidate","sslCA","sslCert","sslKey","sslPass","autoReconnect","socketOptions"]),replset:joi.object().optional().keys(utils.obj.underscoreKeys(b)),user:joi.string().optional().empty(),pass:joi.string().optional().empty()}).allow(["db","server","replset","user","pass"])});return d},module.exports=new ConfigMongoose;