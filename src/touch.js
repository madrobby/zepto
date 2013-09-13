//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout,
    longTapDelay = 750, longTapTimeout

  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode
  }

  function swipeDirection(x1, x2, y1, y2) {
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
    return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  var gesture;
  if ('undefined' !== typeof(MSGesture)) {
    gesture = new MSGesture();
    gesture.target = document.body;
  }

  $(document).ready(function(){
    var now, delta
    
    $(document.body)
      .bind('MSGestureEnd', function(e){
        var swipe_dir = e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
        if (swipe_dir) {
          touch.el.trigger('swipe')
          touch.el.trigger('swipe'+ swipe_dir)
        }
      })
      .on('touchstart MSPointerDown', function(e){
        if(e.type == 'MSPointerDown' && (e.pointerType != e.MSPOINTER_TYPE_TOUCH || !e.isPrimary)) return;
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $(parentIfText(e.type == 'MSPointerDown' ? e.target : e.touches[0].target))
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = (e.type == 'MSPointerDown' ? e.pageX : e.touches[0].pageX)
        touch.y1 = (e.type == 'MSPointerDown' ? e.pageY : e.touches[0].pageY)
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
      })
      .on('touchmove MSPointerMove', function(e){
        if(e.type == 'MSPointerMove' && (e.pointerType != e.MSPOINTER_TYPE_TOUCH || !e.isPrimary)) return;
        cancelLongTap()
        touch.x2 = (e.type == 'MSPointerMove' ? e.pageX : e.touches[0].pageX)
        touch.y2 = (e.type == 'MSPointerMove' ? e.pageY : e.touches[0].pageY)
        if (Math.abs(touch.x1 - touch.x2) > 10)
          e.preventDefault()
      })
      .on('touchend MSPointerUp', function(e){
        if(e.type == 'MSPointerUp' && (e.pointerType != e.MSPOINTER_TYPE_TOUCH || !e.isPrimary)) return;
        cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)

          // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
          // ('tap' fires before 'scroll')
          tapTimeout = setTimeout(function() {

            // trigger universal 'tap' with the option to cancelTouch()
            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
            var event = $.Event('tap')
            event.cancelTouch = cancelAll
            touch.el.trigger(event)

            // trigger double tap immediately
            if (touch.isDoubleTap) {
              touch.el.trigger('doubleTap')
              touch = {}
            }

            // trigger single tap after 250ms of inactivity
            else {
              touchTimeout = setTimeout(function(){
                touchTimeout = null
                touch.el.trigger('singleTap')
                touch = {}
              }, 250)
            }

          }, 0)

      })
      .on('touchcancel MSPointerCancel', cancelAll)

    $(window).on('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.on(m, callback) }
  })
})(Zepto)
