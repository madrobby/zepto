//     Zepto.js
//     jQuery compatibility
//
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function ($) {

  // ### $.isPlainObject
  //
  // returns true if the object is a "plain object", meaning it is
  // either instantiated as new Object() or by {}, example { 'a' : 1, 'b' : 2 }
  //
  // some examples of objects that are not "plain objects":
  // new Array(), [], null, undefined, new Boolean(), 2, false,
  // new Function(), 'string'
  //
  $.isPlainObject = function (obj) {
    var ctor, key;
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if (typeof obj != 'object' || !obj || toString.call(obj) !== '[object Object]'
        || obj.nodeType || "setInterval" in obj) return false;

    // Not own constructor property must be Object
    ctor = typeof obj.constructor === 'function' && obj.constructor.prototype;
    if (!ctor || !hasOwnProperty.call(ctor, 'isPrototypeOf')) return false;

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    for ( key in obj ) {}

    return key === undefined || hasOwnProperty.call( obj, key );
  };

})(Zepto);