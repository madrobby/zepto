//https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() { return factory(global) })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(global)
    } else {
        root.returnExportsGlobal = factory(global)
    }
}(this, function (window) {
  YIELD
  return Zepto
}))
