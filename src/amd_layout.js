(function(global, factory) {
  if (typeof module === "object" && typeof module.exports === "object" )
    module.exports = global.document
      ? factory(global, true)
      : function(w) {
        if (!w.document) throw new Error( "Zepto requires a window with a document" )
        return factory(w)
      }
  else if (typeof define === 'function' && define.amd)
    define(function() { return factory(global) })
  else
    factory(global)
}(typeof window !== "undefined" ? window : this, function(window) {
  YIELD
  return Zepto
}))
