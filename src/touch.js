//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var touch = {}, singleTapTimeout;

  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }

  function swipeDirection(x1, x2, y1, y2){
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'Left' : 'Right');
    } else {
      return (y1 - y2 > 0 ? 'Up' : 'Down');
    }
  }

  var longTapDelay = 750;
  function longTap(){
    if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
      touch.el.trigger('longTap');
      touch = {};
    }
  }

  var doubleTapDuration = 250;
  var minSwipeLengthX = 30;
  var minSwipeLengthY = 30;
  $(document).ready(function(){
    $(document.body).bind('touchstart', function(e){
      var now = Date.now(), delta = now - (touch.last || now);
      touch.el = $(parentIfText(e.touches[0].target));
      singleTapTimeout && clearTimeout(singleTapTimeout);
      touch.x1 = e.touches[0].pageX;
      touch.y1 = e.touches[0].pageY;
      if (delta > 0 && delta <= doubleTapDuration) touch.isDoubleTap = true;
      touch.last = now;
      setTimeout(longTap, longTapDelay);
    }).bind('touchmove', function(e){
      touch.x2 = e.touches[0].pageX;
      touch.y2 = e.touches[0].pageY;
    }).bind('touchend', function(e){
      if (touch.isDoubleTap) {
        touch.el.trigger('doubleTap');
        touch = {};
      } else if (touch.x2 > 0 || touch.y2 > 0) {
        (Math.abs(touch.x1 - touch.x2) > minSwipeLengthX || Math.abs(touch.y1 - touch.y2) > minSwipeLengthY)  &&
          touch.el.trigger('swipe') &&
          touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
        touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
      } else if ('last' in touch) {
        touch.el.trigger('tap');

        singleTapTimeout = setTimeout(function(){
          singleTapTimeout = null;
          touch.el.trigger('singleTap');
          touch = {};
        }, doubleTapDuration);
      }
    }).bind('touchcancel', function(){ touch = {} });
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  });
})(Zepto);
