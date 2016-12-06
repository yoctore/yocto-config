## Default configuration rules : Yocto Render

```javascript
  // default statement
var schema = joi.object().required().keys({
  app     : joi.object().optional().min(1).keys({
    name : joi.string().required().min(3).not(null).empty()
  }),

  render  : joi.object().optional().min(1).keys({
    title     : joi.string().optional().min(3).not(null),
    language  : joi.string().optional().length(2).not(null),
    meta      : joi.array().optional().min(1).items(joi.object().keys({
      name  : joi.string().required().not(null),
      value : joi.string().required().not(null)
    })),
    httpEquiv : joi.array().optional().min(1).items(joi.object().keys({
      name  : joi.string().required().not(null),
      value : joi.string().required().not(null)
    })),
    assets    : joi.object().optional().min(1).keys({
      header : joi.object().optional().min(1).keys({
        css : joi.array().optional().min(1).items(joi.object().keys({
          link  : joi.string().required().not(null),
          media : joi.string().required().not(null),
          defer : joi.string().optional().allow('defer').not(null),
          async : joi.string().optional().allow('async').not(null),
        })),
        js  : joi.array().optional().min(1).items(joi.object().keys({
          link  : joi.string().required().not(null),
          defer : joi.string().optional().allow('defer').not(null),
          async : joi.string().optional().allow('async').not(null)
        }))
      }),
      footer : joi.object().optional().min(1).keys({
        css : joi.array().optional().min(1).items(joi.object().keys({
          link  : joi.string().required().not(null),
          media : joi.string().required().not(null),
          defer : joi.string().optional().allow('defer').not(null),
          async : joi.string().optional().allow('async').not(null),
        })),
        js  : joi.array().optional().min(1).items(joi.object().keys({
          link  : joi.string().required().not(null),
          defer : joi.string().optional().allow('defer').not(null),
          async : joi.string().optional().allow('async').not(null)
        }))
      })
    }),
    mobileIcons : joi.array().optional().min(1).items(
      joi.object().required().keys({
        rel   : joi.string().required().empty(),
        sizes : joi.string().required().empty(),
        href  : joi.string().required().empty()
      })
    ),
    social      : joi.object().optional().min(1).keys({
      facebook  : joi.array().optional().items({
        property  : joi.string().required().empty(),
        content   : joi.string().required().empty()
      }).default([]),
      twitter   : joi.array().optional().items({
        property  : joi.string().required().empty(),
        content   : joi.string().required().empty()
      }).default([]),
      google    : joi.array().optional().items({
        rel   : joi.string().required().empty(),
        href  : joi.string().required().empty()
      }).default([])
    })
  })
});

```

Back to [README](https://gitlab.com/yocto-node-modules/yocto-config/blob/master/README.md).