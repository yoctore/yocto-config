## Default configuration rules : Yocto Router

```javascript
  // default statement
var schema = joi.object().required().keys({
  routes      : joi.string().required().empty().default(),
  controllers : joi.string().required().empty().default()
}).allow([ 'routes', 'controllers' ])

```

Back to [README](https://gitlab.com/yocto-node-modules/yocto-config/blob/master/README.md).