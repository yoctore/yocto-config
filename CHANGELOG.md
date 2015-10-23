## 1.1.0 (2015-10-23)

- Change `passportjs` config key to `passportJs` (camelCase).
- Add a new method to auto enable method from given key
- Add a `type` property on mongoose schema.

## 1.0.6 (2015-10-22)

- Change message when no files was found.

## 1.0.4 (2015-10-16)

- Add jwt rules on default express config format

## 1.0.1 && 1.0.2 && 1.0.3 (2015-10-08)

- Change readme.md content & add new setConfigPath method
- Minor fixes
- Change directory config rules (all dir is not required now)

## 0.3.0 -> 1.0.0 (2015-10-06 <-> 2015-10-07)

- Add readme description
- Add rules to process enable and activate in the same method (1.0.0)
- Add a method to enable a specific schema (0.9.0)
- Add a method to add custom schema (0.8.0)
- Add access method (0.7.0) - to enable passportJs / express / mongoose config
- Add module passportJs (0.5.0) - default config for passportjs
- Add module express  (0.4.0) -  default config for express
- Add module mongoose  (0.3.0) -  default config for mongoose

## 0.2.1 (2015-10-06)

- Hint program with yocto-hitn and fix bugs
- Add Promise return (Q) on load function.

## 0.1.0 (2015-09-25)

Add all base function.
- load : load and test given configuration from given path
- set : default set function to set value
- get : default get value to get property value
- realod : reload configuration from given path if new path was given