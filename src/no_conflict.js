//Mimic jQuery No Conflict. Credit: Bryce
if ( typeof define === "function" && define.amd ) {
  define( "nquery", [], function() {
    return nQuery;
  });
}
var
  // Map over nQuery in case of overwrite
  _nQuery = window.nQuery,

  // Map over the $ in case of overwrite
  _$ = window.$;

nQuery.noConflict = function( deep ) {
  if ( window.$ === nQuery ) {
    window.$ = _$;
  }

  if ( deep && window.nQuery === nQuery ) {
    window.nQuery = _nQuery;
  }
  return nQuery;
};