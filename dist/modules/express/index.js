/* yocto-config - A simple config manager for node app - V1.3.0 */
function ConfigExpressJs(){this.secretKey="yocto-secret-key",this.date=new Date}var joi=require("joi");ConfigExpressJs.prototype.getSchema=function(){var a={app:joi.object().required().keys({name:joi.string().required().empty().min(3),stackError:joi["boolean"]()["default"](!0),session:joi.object()["default"]({timeout:5e4}).keys({timeout:joi.number()["default"](5e4)}).allow("timeout")}).allow(["name","stackError","session"]),express:joi.object().required().keys({jsonp:joi["boolean"]()["default"](!1),prettyHtml:joi["boolean"]()["default"](!0),viewEngine:joi.string().empty()["default"]("jade").allow("jade"),filter:joi.object()["default"]({rules:"json|text|javascript|css|html",by:"Content-type",level:9}).keys({rules:joi.string()["default"]("json|text|javascript|css|html").empty(),by:joi.string()["default"]("Content-Type").allow("Content-Type"),level:joi.number()["default"](9).min(0).max(9)}).allow(["rules","by","level"]),json:joi.object()["default"]({inflate:!0,limit:"100kb",strict:!0,type:"json"}).keys({inflate:joi["boolean"]().optional()["default"](!0),limit:joi.string().optional().empty()["default"]("100kb"),strict:joi["boolean"]().optional()["default"](!0),type:joi.string().optional().empty()["default"]("json").valid("json")}).allow(["inflate","limit","strict","type"]),urlencoded:joi.object()["default"]({extended:!0,inflate:!0,limit:"100kb",parameterLimit:1e3,type:"urlencoded"}).keys({extended:joi["boolean"]().optional()["default"](!0),inflate:joi["boolean"]().optional()["default"](!0),limit:joi.string().optional().empty()["default"]("100kb"),parameterLimit:joi.number()["default"](1e3).min(1e3),type:joi.string().optional().empty()["default"]("urlencoded").valid("urlencoded")}).allow(["extended","inflate","limit","parameterLimit","type","verify"]),methodOverride:joi.array().min(1).unique()["default"](["_method"]).items([joi.string().empty()["default"]("_method").valid(["_method","X-HTTP-Method","X-HTTP-Method-Override","X-Method-Override"])]),cookieParser:joi.object()["default"]({enable:!1,secret:"yocto-cookie-parser-secret-key",options:{}}).keys({enable:joi["boolean"]()["default"](!0),secret:joi.string().empty()["default"](this.secretKey),options:joi.object()["default"]({path:"/",expires:this.date,maxAge:0,domain:null,secure:!0,httpOnly:!0}).keys({path:joi.string().empty().optional()["default"]("/"),expires:joi.string().empty().optional()["default"](this.date),maxAge:joi.number().optional()["default"](0),domain:joi.string().empty().optional()["default"](null),secure:joi["boolean"]().optional()["default"](!0),httpOnly:joi["boolean"]().optional()["default"](!1)}).allow(["path","expires","maxAge","domain","secure","httpOnly"])}).allow(["enable","secret","options"]),multipart:joi["boolean"]()["default"](!1),session:joi.object()["default"]({enable:!1}).keys({enable:joi["boolean"]()["default"](!0),options:joi.object().optional().keys({cookie:joi.object()["default"]({path:"/",httpOnly:!1,secure:!0,maxAge:null}).keys({path:joi.string().optional()["default"]("/"),httpOnly:joi["boolean"]().optional()["default"](!1),secure:joi["boolean"]().optional()["default"](!0),maxAge:joi.number().optional()["default"](null)}).allow(["path","httpOnly","secure","maxAge"]),secret:joi.string().optional().min(8)["default"](this.secretKey),name:joi.string().optional().min(5)["default"]("connect.sid"),genuuid:joi["boolean"]().optional()["default"](!1),proxy:joi["boolean"]().optional()["default"](void 0),resave:joi["boolean"]().optional()["default"](!1),saveUninitialized:joi["boolean"]().optional()["default"](!0),store:joi.object().optional().keys({instance:joi.string().required().empty().valid("mongo"),uri:joi.string().required().empty(),type:joi.string().required().empty().valid(["mongoose","native","uri"])}).allow(["db","uri","type"]),rolling:joi["boolean"]().optional()["default"](!1)}).allow(["cookie","secret","name","genuuid","proxy","resave","saveUninitialized","rolling"])}).allow(["enable","options"]),security:joi.object()["default"]({csrf:{key:"_csrf",secret:this.secretKey},csp:{},xframe:"SAMEORIGIN",p3p:"_p3p",hsts:{},xssProtection:!0}).keys({csrf:joi.object()["default"]({key:"_csrf",secret:this.secretKey}).keys({key:joi.string().empty()["default"]("_csrf"),secret:joi.string().empty()["default"](this.secretKey)}),csp:joi.object()["default"]({}).keys({policy:joi.object()["default"]({}).keys({"default-src":joi.string().empty(),"script-src":joi.string().empty(),"object-src":joi.string().empty(),"style-src":joi.string().empty(),"img-src":joi.string().empty(),"media-src":joi.string().empty(),"frame-src":joi.string().empty(),"font-src":joi.string().empty(),"connect-src":joi.string().empty(),"form-action ":joi.string().empty(),sandbox:joi.string().empty(),"script-nonce":joi.string().empty(),"plugin-types":joi.string().empty(),"reflected-xss":joi.string().empty(),"report-uri":joi.string().empty()}).allow(["default-src","script-src","object-src","style-src","img-src","media-src","frame-src","font-src","connect-src","form-action","sandbox","script-nonce","plugin-types","reflected-xss","report-uri"]),reportOnly:joi["boolean"]()["default"](!1),reportUri:joi.string()}).allow("policy","reportOnly","reportUri"),xframe:joi.string().empty()["default"]("SAMEORIGIN").valid(["DENY","SAMEORIGIN","ALLOW-FROM"]),p3p:joi.string().empty()["default"]("_p3p"),hsts:joi.object()["default"]({maxAge:0,includeSubDomains:!0,preload:!0}).keys({maxAge:joi.number().optional()["default"](null),includeSubDomains:joi["boolean"]()["default"](!0),preload:joi["boolean"]()["default"](!0)}),xssProtection:joi["boolean"]()["default"](!0)}).allow(["csrf","csp","xframe","p3p","hsts","xssProtection"]),vhost:joi.object().optional().keys({enable:joi["boolean"]().required()["default"](!1),options:joi.object().optional().keys({url:joi.string().required()["default"]("/"),aliases:joi.array().items(joi.string().required().empty()),subdomains:joi["boolean"]().required()["default"](!1),http:joi.object().optional().keys({redirect:joi.object().required().keys({type:joi.number(),url:joi.string().required().empty(),port:joi.number().required()}).allow(["type","url","port"])}).allow("redirect")}).allow(["url","aliases","subdomains","http"])}).allow(["enable","options"])}),port:joi.number()["default"](3e3),host:joi.string()["default"]("127.0.0.1").empty().min(7),directory:joi.array().optional().min(1).unique()["default"]([{models:"/"},{controllers:"/"},{views:"/"},{"public":"/"},{icons:"/"}]).items([joi.object().keys({models:joi.string().empty().min(1)["default"]("/")}),joi.object().keys({controllers:joi.string().empty().min(1)["default"]("/")}),joi.object().keys({views:joi.string().empty().min(1)["default"]("/")}),joi.object().keys({"public":joi.string().empty().min(1)["default"]("/")}),joi.object().keys({icons:joi.string().empty().min(1)["default"]("/")}),joi.object().empty()]),encrypt:joi.object()["default"]({key:this.secretKey,type:"hex"}).keys({key:joi.string()["default"](this.secretKey).empty(),type:joi.string()["default"]("hex").valid(["ascii","utf8","utf16le","ucs2","base64","binary","hex"])}),jwt:joi.object()["default"]({enable:!1,key:this.secretKey}).keys({enable:joi["boolean"]()["default"](!1),key:joi.string()["default"](this.secretKey)}),cors:joi["boolean"]()["default"](!1)};return a},module.exports=new ConfigExpressJs;