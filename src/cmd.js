//     Zepto.js
//     (c) 2010-2014 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// Support for CMD

;(function($){
  if (typeof define === 'function' && define.cmd)
    define(function(){return $})
})(Zepto)
