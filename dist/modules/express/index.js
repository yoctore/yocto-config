/* yocto-config - A simple config manager for node app - V1.8.3 */
"use strict";function ConfigExpressJs(){this.secretKey="yocto-secret-key",this.date=new Date}var joi=require("joi");ConfigExpressJs.prototype.getSchema=function(){var a={app:joi.object().required().keys({name:joi.string().required().empty().min(3),stackError:joi.boolean().default(!0),session:joi.object().default({timeout:5e4}).keys({timeout:joi.number().default(5e4)}).allow("timeout")}).allow(["name","stackError","session"]),express:joi.object().required().keys({jsonp:joi.boolean().default(!1),prettyHtml:joi.boolean().default(!0),viewEngine:joi.string().empty().default("jade").allow("jade"),filter:joi.object().default({rules:"json|text|javascript|css|html",by:"Content-type",level:9}).keys({rules:joi.string().default("json|text|javascript|css|html").empty(),by:joi.string().default("Content-Type").allow("Content-Type"),level:joi.number().default(9).min(0).max(9)}).allow(["rules","by","level"]),json:joi.object().default({inflate:!0,limit:"100kb",strict:!0,type:"json"}).keys({inflate:joi.boolean().optional().default(!0),limit:joi.string().optional().empty().default("100kb"),strict:joi.boolean().optional().default(!0),type:joi.string().optional().empty().default("json").valid("json")}).allow(["inflate","limit","strict","type"]),urlencoded:joi.object().default({extended:!0,inflate:!0,limit:"100kb",parameterLimit:1e3,type:"urlencoded"}).keys({extended:joi.boolean().optional().default(!0),inflate:joi.boolean().optional().default(!0),limit:joi.string().optional().empty().default("100kb"),parameterLimit:joi.number().default(1e3).min(1e3),type:joi.string().optional().empty().default("urlencoded").valid("urlencoded")}).allow(["extended","inflate","limit","parameterLimit","type","verify"]),methodOverride:joi.array().min(1).unique().default(["_method"]).items([joi.string().empty().default("_method").valid(["_method","X-HTTP-Method","X-HTTP-Method-Override","X-Method-Override"])]),cookieParser:joi.object().default({enable:!1,secret:"yocto-cookie-parser-secret-key",options:{}}).keys({enable:joi.boolean().default(!0),secret:joi.string().empty().default(this.secretKey),options:joi.object().default({path:"/",expires:this.date,maxAge:0,domain:null,secure:!0,httpOnly:!0}).keys({path:joi.string().empty().optional().default("/"),expires:joi.string().empty().optional().default(this.date),maxAge:joi.number().optional().default(0),domain:joi.string().empty().optional().default(null),secure:joi.boolean().optional().default(!0),httpOnly:joi.boolean().optional().default(!1)}).allow(["path","expires","maxAge","domain","secure","httpOnly"])}).allow(["enable","secret","options"]),multipart:joi.boolean().default(!1),session:joi.object().default({enable:!1}).keys({enable:joi.boolean().default(!0),options:joi.object().optional().keys({cookie:joi.object().default({path:"/",httpOnly:!1,secure:!0,maxAge:null,domain:null}).keys({path:joi.string().optional().default("/"),httpOnly:joi.boolean().optional().default(!1),secure:joi.boolean().optional().default(!0),maxAge:joi.number().optional().default(null),domain:joi.string().optional().default(null)}).allow(["path","httpOnly","secure","maxAge","domain"]),secret:joi.string().optional().min(8).default(this.secretKey),name:joi.string().optional().min(5).default("connect.sid"),genuuid:joi.boolean().optional().default(!1),proxy:joi.boolean().optional().default(void 0),resave:joi.boolean().optional().default(!1),saveUninitialized:joi.boolean().optional().default(!0),store:joi.object().optional().keys({instance:joi.string().required().empty().valid("mongo"),uri:joi.string().required().empty(),type:joi.string().required().empty().valid(["mongoose","native","uri"]),options:joi.object().optional().keys({ssl:joi.boolean().optional(),sslValidate:joi.boolean().optional(),sslCA:joi.string().optional().empty(),sslKey:joi.string().optional().empty(),sslCert:joi.string().optional().empty(),checkServerIdentity:joi.boolean().optional()}).unknown()}).allow(["db","uri","type","options"]),rolling:joi.boolean().optional().default(!1)}).allow(["cookie","secret","name","genuuid","proxy","resave","saveUninitialized","rolling"])}).allow(["enable","options"]),security:joi.object().default({enable:!0,csrf:{key:"_csrf",secret:this.secretKey,angular:!0},csp:{policy:{"default-src":"none","script-src":"'self'","object-src":"'self'","style-src":"'self'","img-src":"'self'","media-src":"'self'","child-src":"'self'","font-src":"'self'","connect-src":"'self'","form-action":"'self'",sandbox:"allow-forms allow-scripts","script-nonce":"'self'","plugin-types":"'self'","reflected-xss":"'self'","report-uri":"'self'"},reportOnly:!1},xframe:"SAMEORIGIN",p3p:"_p3p",hsts:{maxAge:0,includeSubDomains:!0,preload:!0},xssProtection:!0,nosniff:!0}).keys({enable:joi.boolean().default(!0),csrf:joi.object().default({key:"_csrf",secret:this.secretKey,angular:!0}).keys({key:joi.string().empty().default("_csrf"),secret:joi.string().empty().default(this.secretKey),angular:joi.boolean().default(!0)}),csp:joi.object().default({policy:{"default-src":"none","script-src":"'self'","object-src":"'self'","style-src":"'self'","img-src":"'self'","media-src":"'self'","child-src":"'self'","font-src":"'self'","connect-src":"'self'","form-action":"'self'","script-nonce":"'self'","plugin-types":"'self'","reflected-xss":"'self'","report-uri":"'self'"},reportOnly:!1}).keys({policy:joi.object().default({"default-src":"none","script-src":"'self'","object-src":"'self'","style-src":"'self'","img-src":"'self'","media-src":"'self'","child-src":"'self'","font-src":"'self'","connect-src":"'self'","form-action":"'self'","script-nonce":"'self'","plugin-types":"'self'","reflected-xss":"'self'","report-uri":"'self'"}).keys({"default-src":joi.string().empty().default("none"),"script-src":joi.string().empty().default("'self'"),"object-src":joi.string().empty().default("'self'"),"style-src":joi.string().empty().default("'self'"),"img-src":joi.string().empty().default("'self'"),"media-src":joi.string().empty().default("'self'"),"child-src":joi.string().empty().default("'self'"),"font-src":joi.string().empty().default("'self'"),"connect-src":joi.string().empty().default("'self'"),"form-action":joi.string().empty().default("'self'"),sandbox:joi.string().optional().empty(),"script-nonce":joi.string().empty().default("'self'"),"plugin-types":joi.string().empty().default("'self'"),"reflected-xss":joi.string().empty().default("'self'"),"report-uri":joi.string().empty().default("'self'")}).allow(["default-src","script-src","object-src","style-src","img-src","media-src","child-src","font-src","connect-src","form-action","sandbox","script-nonce","plugin-types","reflected-xss","report-uri"]),reportOnly:joi.boolean().default(!1),reportUri:joi.string()}).allow("policy","reportOnly","reportUri"),xframe:joi.string().empty().default("SAMEORIGIN"),p3p:joi.string().empty().default("_p3p"),hsts:joi.object().default({maxAge:0,includeSubDomains:!0,preload:!0}).keys({maxAge:joi.number().optional().default(null),includeSubDomains:joi.boolean().default(!0),preload:joi.boolean().default(!0)}),xssProtection:joi.boolean().default(!0),nosniff:joi.boolean().default(!0)}).allow(["csrf","csp","xframe","p3p","hsts","xssProtection","nosniff"]),vhost:joi.object().optional().keys({enable:joi.boolean().required().default(!1),options:joi.object().optional().keys({url:joi.string().required().default("/"),aliases:joi.array().items(joi.string().required().empty()),subdomains:joi.boolean().required().default(!1),http:joi.object().optional().keys({redirect:joi.object().required().keys({type:joi.number(),url:joi.string().required().empty(),port:joi.number().required()}).allow(["type","url","port"])}).allow("redirect")}).allow(["url","aliases","subdomains","http"])}).allow(["enable","options"])}),host:joi.string().default("127.0.0.1").empty(),protocol:joi.object().default({type:"http"}).keys({type:joi.string().default("http").valid(["http","https"]),port:joi.number().when("type",{is:"http",then:joi.number().default(3e3),otherwise:joi.number().default(443)}),certificate:joi.object().when("type",{is:"http",then:joi.optional(),otherwise:joi.object().required().keys({key:joi.string().required().empty(),cert:joi.string().required().empty()})})}),directory:joi.array().optional().min(1).unique().default([{models:"/"},{controllers:"/"},{views:"/"},{public:"/"},{icons:"/"}]).items([joi.object().keys({models:joi.string().empty().min(1).default("/")}),joi.object().keys({controllers:joi.string().empty().min(1).default("/")}),joi.object().keys({views:joi.string().empty().min(1).default("/")}),joi.object().keys({public:joi.string().empty().min(1).default("/")}),joi.object().keys({icons:joi.string().empty().min(1).default("/")}),joi.object().empty()]),encrypt:joi.object().default({key:this.secretKey,type:"hex"}).keys({key:joi.string().default(this.secretKey).empty(),type:joi.string().default("hex").valid(["ascii","utf8","utf16le","ucs2","base64","binary","hex"])}),jwt:joi.object().default({enable:!1,key:this.secretKey,ips:[]}).keys({enable:joi.boolean().default(!1),key:joi.string().default(this.secretKey),ips:joi.array().items(joi.string().required().empty()),allowedRoutes:joi.array().optional().items(joi.string().required().empty()),autoEncryptRequest:joi.boolean().optional().default(!0),autoDecryptRequest:joi.boolean().optional().default(!0)}),cors:joi.boolean().default(!1),corsCfg:joi.object().optional().keys({origin:joi.array().optional().items(joi.string().required().empty()),methods:joi.array().optional().items(joi.string().required().empty().valid(["GET","HEAD","PUT","PATCH","POST","DELETE","OPTIONS"])),allowedHeaders:joi.array().optional().items(joi.string().required().empty()),exposedHeaders:joi.array().optional().items(joi.string().required().empty()),credentials:joi.boolean().optional(),maxAge:joi.number().optional(),preflightContinue:joi.boolean().optional()}).allow(["origin","methods","allowedHeaders","exposedHeaders","credentials","maxAge","preflightContinue"]),redirect:joi.object().optional().keys({www:joi.boolean().optional(),seo:joi.array().optional().items(joi.object().required().keys({code:joi.number().required(),fromUrl:joi.string().required().empty(),toUrl:joi.string().required().empty(),queryString:joi.boolean().optional()}))})};return a},module.exports=new ConfigExpressJs;