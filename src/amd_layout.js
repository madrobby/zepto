(function(global, factory) {
  if (typeof define === 'function' && define.amd)
    define(function() { return factory(global) })
  else
    factory(global)
}(window, function(window) {
  YIELD
  return Zepto
}))
