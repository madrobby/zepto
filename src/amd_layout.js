(function(global, factory) {
  if (typeof define === 'function' && define.amd)
    define(function() { return factory(global) })
  else
    factory(global)
}(typeof window !== 'undefined' ? window : this, function(window) {
  YIELD
  return Zepto
}))
