//     Zepto.js
//     (c) 2010-2013 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// this provides a incomplete but workable implementation of
// __proto__, which enables Zepto to run on Internet Explorer <= 10
;(function(){
  if (!('__proto__' in {})) {
    Object.defineProperty(Object.prototype, '__proto__', {
      set: function(newPrototype) {
        for (var property in newPrototype) {
          // stops stack overflow errors
          if (property == '__proto__') continue

          this[property] = newPrototype[property]
        }
      },
      get: function() {
        return this
      },
      enumerable: false,
      configurable: true
    });
  }

  // getComputedStyle shouldn't freak out when called
  // without a valid element as argument
  try{
    getComputedStyle(undefined)
  } catch(e) {
    var nativeGetComputedStyle = getComputedStyle;
    window.getComputedStyle = function(element){
      try{
        return nativeGetComputedStyle(element)
      } catch(e) {
        return null
      }
    }
  }
})()
