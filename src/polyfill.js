//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function(undefined){
  if (String.prototype.trim === undefined) // fix for iOS 3.2
    String.prototype.trim = function(){ this.replace(/^\s+|\s+$/g, '') }; // smaller trim (from jQuery)
    
  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(accumulator){
      var i = 0, obj = this, l = obj.length >> 0, curr; // ">> 0" avoids null test later

      /* null and undefined never got length. That's why we don't need "Object(this)". 
       * All the other possibilities are objects in js
       */

      if(typeof accumulator !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
        throw new TypeError();

      if(arguments.length < 2) { // "<= 1" is slower
        if (l === 0) throw new TypeError(); // just inside the only test for "arguments <= 1"
        curr = obj[0]; // Increase i to start searching the secondly defined element in the array
        i = 1; // start accumulating at the second element
      }
      else curr = arguments[1];

      for (;i < l;++i) // "for" is smaller than "while"; ++i is faster than i++
        if(i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);

      return curr;
    };
  }
  
})();
