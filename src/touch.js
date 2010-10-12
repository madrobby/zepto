(function($){
  var d = document, touch={}, touchTimeout;
  
  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }
  
  d.ontouchstart = function(e) {
    var now = Date.now(), delta = now-(touch.last || now);
    touch.target = parentIfText(e.touches[0].target);
    touchTimeout && clearTimeout(touchTimeout);
    touch.x1 = e.touches[0].pageX;
    if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
    touch.last = now;
  }

  d.ontouchmove = function(e) { touch.x2 = e.touches[0].pageX }
  
  d.ontouchend = function(e) {
    if (touch.isDoubleTap) {
      $(touch.target).trigger('doubleTap');
      touch = {};
    } else if (touch.x2 > 0) {
      Math.abs(touch.x1-touch.x2)>30 && $(touch.target).trigger('swipe');
      touch.x1 = touch.x2 = touch.last = 0;
    } else if ('last' in touch) {
      touchTimeout = setTimeout(function(){
        touchTimeout = null;
        $(touch.target).trigger('tap')
        touch = {};
      }, 250);
    }
  }
  
  d.ontouchcancel = function(){ touch={} };
  
  ['swipe', 'doubleTap', 'tap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  });
})(Zepto);
