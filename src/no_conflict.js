//Mimic jQuery No Conflict. Credit: Bryce
if ( typeof define === "function" && define.amd ) {
  define( "zepto", [], function() {
    return Zepto;
  });
}
var
  // Map over Zepto in case of overwrite
  _nQuery = window.Zepto,

  // Map over the $ in case of overwrite
  _$ = window.$;

Zepto.noConflict = function( deep ) {
  if ( window.$ === Zepto ) {
    window.$ = _$;
  }

  if ( deep && window.Zepto === Zepto ) {
    window.Zepto = _nQuery;
  }
  return Zepto;
};