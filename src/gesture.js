//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  if ($.os.ios) {
    var gesture = {}, gestureTimeout;

    function parentIfText(node){
      return 'tagName' in node ? node : node.parentNode;
    }

    $(document).bind('gesturestart', function(e){
      var now = Date.now(), delta = now - (gesture.last || now);
      gesture.target = parentIfText(e.target);
      gestureTimeout && clearTimeout(gestureTimeout);
      gesture.e1 = e.scale;
      gesture.last = now;
    }).bind('gesturechange', function(e){
      gesture.e2 = e.scale;
    }).bind('gestureend', function(e){
      if (gesture.e2 > 0) {
        Math.abs(gesture.e1 - gesture.e2) != 0 && $(gesture.target).trigger('pinch') &&
          $(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'));
        gesture.e1 = gesture.e2 = gesture.last = 0;
      } else if ('last' in gesture) {
        gesture = {};
      }
    });

    ['pinch', 'pinchIn', 'pinchOut'].forEach(function(m){
      $.fn[m] = function(callback){ return this.bind(m, callback) }
    });
  }
})(Zepto);
