"use strict";function Config(){this.config={},this.state=!1,this.env="development",this.base=process.cwd(),this.logger=logger,this.schema=joi.object().min(1).keys({app:joi.object().required().keys({name:joi.string().required().empty().min(3),stackError:joi["boolean"]()["default"](!0),session:joi.object()["default"]({timeout:5e4}).keys({timeout:joi.number()["default"](5e5)}).allow("timeout")}).allow("name","stackError","session"),express:joi.object().required().keys({jsonp:joi["boolean"]()["default"](!1),prettyHtml:joi["boolean"]()["default"](!0),viewEngine:joi.string().empty()["default"]("jade").allow("jade"),filter:joi.object()["default"]({rules:"json|text|javascript|css|html",by:"Content-type",level:9}).keys({rules:joi.string()["default"]("json|text|javascript|css|html").empty(),by:joi.string()["default"]("Content-Type").allow("Content-Type"),level:joi.number()["default"](9).min(0).max(9)}).allow("rules","by","level"),json:joi.object()["default"]({inflate:!0,limit:"100kb",strict:!0,type:"json"}).keys({inflate:joi["boolean"]().optional()["default"](!0),limit:joi.string().optional().empty()["default"]("100kb"),strict:joi["boolean"]().optional()["default"](!0),type:joi.string().optional().empty()["default"]("json").valid("json")}).allow("inflate","limit","strict","type"),urlencoded:joi.object()["default"]({extended:!0,inflate:!0,limit:"100kb",parameterLimit:1e3,type:"urlencoded"}).keys({extended:joi["boolean"]().optional()["default"](!0),inflate:joi["boolean"]().optional()["default"](!0),limit:joi.string().optional().empty()["default"]("100kb"),parameterLimit:joi.number()["default"](1e3).min(1e3),type:joi.string().optional().empty()["default"]("urlencoded").valid("urlencoded")}).allow("extended","inflate","limit","parameterLimit","type","verify"),methodOverride:joi.array().min(1).unique()["default"](["_method"]).items([joi.string().empty()["default"]("_method").valid("_method","X-HTTP-Method","X-HTTP-Method-Override","X-Method-Override")]),cookieParser:joi.object()["default"]({enable:!1,secret:"yocto-cookie-parser-secret-key",options:{}}).keys({enable:joi["boolean"]()["default"](!0),secret:joi.string().empty()["default"]("yocto-cookie-parser-secret-key"),options:joi.object()["default"]({path:"/",expires:"Fri, 31 Dec 9999 23:59:59 GMT",maxAge:0,domain:null,secure:!0,httpOnly:!0}).keys({path:joi.string().empty().optional()["default"]("/"),expires:joi.string().empty().optional()["default"]("Fri, 31 Dec 9999 23:59:59 GMT"),maxAge:joi.number().optional()["default"](0),domain:joi.string().empty().optional()["default"](null),secure:joi["boolean"]().optional()["default"](!0),httpOnly:joi["boolean"]().optional()["default"](!1)}).allow("path","expires","maxAge","domain","secure","httpOnly")}).allow("enable","secret","options"),multipart:joi["boolean"]()["default"](!1),session:joi.object()["default"]({enable:!1}).keys({enable:joi["boolean"]()["default"](!0),options:joi.object().optional().keys({cookie:joi.object()["default"]({path:"/",httpOnly:!1,secure:!0,maxAge:null}).keys({path:joi.string().optional()["default"]("/"),httpOnly:joi["boolean"]().optional()["default"](!1),secure:joi["boolean"]().optional()["default"](!0),maxAge:joi.number().optional()["default"](null)}).allow("path","httpOnly","secure","maxAge"),secret:joi.string().optional().min(8)["default"]("yocto-config-secret-key"),name:joi.string().optional().min(5)["default"]("connect.sid"),genuuid:joi["boolean"]().optional()["default"](!1),proxy:joi["boolean"]().optional()["default"](void 0),resave:joi["boolean"]().optional()["default"](!1),saveUninitialized:joi["boolean"]().optional()["default"](!0),rolling:joi["boolean"]().optional()["default"](!1)}).allow("cookie","secret","name","genuuid","proxy","resave","saveUninitialized","rolling")}).allow("enable","options"),security:joi.object()["default"]({csrf:{key:"_csrf",secret:"yocto-csrf-secret-key"},csp:{},xframe:"SAMEORIGIN",p3p:"_p3p",hsts:{},xssProtection:!0}).keys({csrf:joi.object()["default"]({key:"_csrf",secret:"yocto-csrf-secret-key"}).keys({key:joi.string().empty()["default"]("_csrf"),secret:joi.string().empty()["default"]("yocto-csrf-secret-key")}),csp:joi.object()["default"]({}).keys({policy:joi.object()["default"]({}).keys({"default-src":joi.string().empty(),"script-src":joi.string().empty(),"object-src":joi.string().empty(),"style-src":joi.string().empty(),"img-src":joi.string().empty(),"media-src":joi.string().empty(),"frame-src":joi.string().empty(),"font-src":joi.string().empty(),"connect-src":joi.string().empty(),"form-action ":joi.string().empty(),sandbox:joi.string().empty(),"script-nonce":joi.string().empty(),"plugin-types":joi.string().empty(),"reflected-xss":joi.string().empty(),"report-uri":joi.string().empty()}).allow("default-src","script-src","object-src","style-src","img-src","media-src","frame-src","font-src","connect-src","form-action","sandbox","script-nonce","plugin-types","reflected-xss","report-uri"),reportOnly:joi["boolean"]()["default"](!1),reportUri:joi.string()}).allow("policy","reportOnly","reportUri"),xframe:joi.string().empty()["default"]("SAMEORIGIN").valid("DENY","SAMEORIGIN","ALLOW-FROM"),p3p:joi.string().empty()["default"]("_p3p"),hsts:joi.object()["default"]({maxAge:0,includeSubDomains:!0,preload:!0}).keys({maxAge:joi.number().optional()["default"](null),includeSubDomains:joi["boolean"]()["default"](!0),preload:joi["boolean"]()["default"](!0)}),xssProtection:joi["boolean"]()["default"](!0)}).allow("csrf","csp","xframe","p3p","hsts","xssProtection"),vhost:joi.object().optional().keys({enable:joi["boolean"]().required()["default"](!1),options:joi.object().optional().keys({url:joi.string().required()["default"]("/"),aliases:joi.array().items(joi.string().required().empty()),subdomains:joi["boolean"]().required()["default"](!1),http:joi.object().optional().keys({redirect:joi.object().required().keys({type:joi.number(),url:joi.string().required().empty(),port:joi.number().required()}).allow("type","url","port")}).allow("redirect")}).allow("url","aliases","subdomains","http")}).allow("enable","options")}),env:joi.string()["default"]("development").empty().valid(["development","staging","production"]),port:joi.number()["default"](3e3),directory:joi.array().min(1).unique()["default"]([{models:"/"},{controllers:"/"},{views:"/"},{"public":"/"},{icons:"/"}]).items([joi.object().required().keys({models:joi.string().empty().min(2)["default"]("/")}),joi.object().required().keys({controllers:joi.string().empty().min(2)["default"]("/")}),joi.object().required().keys({views:joi.string().empty().min(2)["default"]("/")}),joi.object().required().keys({"public":joi.string().empty().min(2)["default"]("/")}),joi.object().required().keys({icons:joi.string().empty().min(2)["default"]("/")}),joi.object().empty()]),encrypt_key:joi.object()["default"]({key:"MyAppKey",type:"hex"}).keys({key:joi.string()["default"]("MyAppKey").empty(),type:joi.string()["default"]("hex").valid(["ascii","utf8","utf16le","ucs2","base64","binary","hex"])})}).unknown(!0)}var path=require("path"),_=require("lodash"),logger=require("yocto-logger"),joi=require("joi"),fs=require("fs"),glob=require("glob"),util=require("util");Config.prototype.set=function(a,b){return _.isUndefined(a)||!_.isString(a)||_.isEmpty(a)?this.logger.warning("[ Core.set ] - Invalid value given. name must be a string and not empty. Operation aborted !"):("base"==a&&"."==b.charAt(0)&&(b=path.normalize([process.cwd(),b].join("/"))),this[a]=b),this},Config.prototype.get=function(a){return this[a]},Config.prototype.reload=function(a){return _.isUndefined(a)||_.isNull(a)||!_.isString(a)||_.isEmpty(a)||(this.base=a),this.load()},Config.prototype.load=function(){try{var a={},b=path.normalize([this.base,"*.json"].join("/")),c=path.normalize([this.base,[this.env,".json"].join("")].join("/")),d=glob.sync(b);if(_.isEmpty(d))throw"No path was found. operation aborted !";d=_.sortBy(d,function(a){var b=path.normalize([this.base,"all.json"].join("/")),c=path.normalize([this.base,"common.json"].join("/")),d=path.normalize([this.base,"development.json"].join("/")),e=path.normalize([this.base,"staging.json"].join("/")),f=path.normalize([this.base,"production.json"].join("/"));return[a==f,a==e,a==d,a==c,a==b,a==a].join("|")},this),_.each(d,function(b){var d=JSON.parse(fs.readFileSync(b,"utf-8"));return _.merge(a,d),c!=b});var e=joi.validate(a,this.get("schema"),{abortEarly:!1});if(!_.isNull(e.error))throw _.each(e.error.details,function(a){this.logger.warning(["[ Config.load ] - Cannot update config an error occured. Error is :",util.inspect(a,{depth:null})].join(" "))},this),"Config validation failed";_.each(a.directory,function(a){var b=_.first(_.values(a));"."==b.charAt(0)&&(b=path.normalize([process.cwd(),b].join("/")));var c=[_.first(_.keys(a)),"directory"].join("_").toUpperCase();this[c]=b},this),this.state=!0,this.config=e.value,this.logger.info(["[ Config.load ] - Success - Config file was changed with files based on :",this.base].join(" "))}catch(f){return this.logger.error(["[ Config.load ] - an error occured during load config file. Error is :",f].join(" ")),!1}return!0},module.exports=new Config;