//     Zepto.js
//     (c) 2010-2013 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function(){
  // __proto__ doesn't exist on IE<11, so redefine
  // the Z function to use object extension instead
  // No Thankyou!
  /*if (!('__proto__' in {})) {
    $.extend($.zepto, {
      Z: function(dom, selector) {
        dom = dom || []
        $.extend(dom, $.fn)
        dom.selector = selector || ''
        return dom
      }
    })
  }*/

  // getComputedStyle shouldn't freak out when called
  // without a valid element as argument
  try {
    getComputedStyle(undefined)
  } catch(e) {
    var nativeGetComputedStyle = getComputedStyle;
    window.getComputedStyle = function(element){
      try {
        return nativeGetComputedStyle(element)
      } catch(e) {
        return null
      }
    }
  }
})()
