/* yocto-config - A simple config manager for node app - V1.7.3 */
"use strict";function ConfigRender(){}var joi=require("joi");ConfigRender.prototype.getSchema=function(){var a=joi.object().keys({name:joi.string().required().not(null),value:joi.string().required().not(null)}),b=joi.object().keys({link:joi.string().required().not(null),media:joi.string().required().not(null),defer:joi.string().optional().allow("defer").not(null),async:joi.string().optional().allow("async").not(null)}),c=joi.object().keys({link:joi.string().required().not(null),defer:joi.string().optional().allow("defer").not(null),async:joi.string().optional().allow("async").not(null)}),d={css:joi.array().optional().min(1).items(b),js:joi.array().optional().min(1).items(c)},e={header:joi.object().optional().min(1).keys(d),footer:joi.object().optional().min(1).keys(d)},f={property:joi.string().required().empty(),content:joi.string().required().empty()},g={rel:joi.string().required().empty(),href:joi.string().required().empty()},h={facebook:joi.array().optional().items(f)["default"]([]),twitter:joi.array().optional().items(f)["default"]([]),google:joi.array().optional().items(g)["default"]([])};return joi.object().required().keys({app:joi.object().optional().min(1).keys({name:joi.string().required().min(3).not(null).empty()}),property:joi.object().optional().min(1).keys({title:joi.string().optional().min(3).not(null),language:joi.string().optional().length(2).not(null),meta:joi.array().optional().min(1).items(a),httpEquiv:joi.array().optional().min(1).items(a),assets:joi.object().optional().min(1).keys(e),mobileIcons:joi.array().optional().min(1).items(joi.object().required().keys({rel:joi.string().required().empty(),sizes:joi.string().required().empty(),href:joi.string().required().empty()})),social:joi.object().optional().min(1).keys(h)})}).allow(["app","property"])},module.exports=new ConfigRender;