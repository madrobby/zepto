//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var touch = {},
      touchTimeout, longTapTimeout,
      longTapDelay = 750,
      gesture

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
    Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
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
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = longTapTimeout = null
    touch = {}
  }

  $(document).ready(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch

    if ('MSGesture' in window) {
      gesture = new MSGesture()
      gesture.target = document.body
    }

    $(document)
        .bind('MSGestureEnd', function(e){
          var swipeDirectionFromVelocity =
              e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
          if (swipeDirectionFromVelocity) {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
          }
        })
        .on('touchstart', function(e){
          firstTouch = e.touches[0]
          if (e.touches && e.touches.length === 1 && touch.x2) {
            // Clear out touch movement data if we have it sticking around
            // This can occur if touchcancel doesn't fire due to preventDefault, etc.
            touch.x2 = undefined
            touch.y2 = undefined
          }
          now = Date.now()
          delta = now - (touch.last || now)
          touch.el = $('tagName' in firstTouch.target ?
              firstTouch.target : firstTouch.target.parentNode)
          touchTimeout && clearTimeout(touchTimeout)
          touch.x1 = firstTouch.pageX
          touch.y1 = firstTouch.pageY
          if (delta > 0 && delta <= 250) touch.isDoubleTap = true
          touch.last = now
          longTapTimeout = setTimeout(longTap, longTapDelay)
          // adds the current touch contact for IE gesture recognition
        })
        .on('touchmove', function(e){
          firstTouch = e.touches[0]
          cancelLongTap()

          // 促发touchcancel/pointercancel时touch会被设置成{}，这时如果手没有离开屏幕继续滑动就会持续促发touchmove导致deltaX\deltaY变成NaN
          if(touch.x1){
            touch.x2 = firstTouch.pageX
            touch.y2 = firstTouch.pageY

            deltaX += Math.abs(touch.x1 - touch.x2)
            deltaY += Math.abs(touch.y1 - touch.y2)
          }else{
            // 当touch.x1不存在时说明deltaX和deltaY已经是过期的计算结果，需要reset，否则tap不会促发
            deltaX = deltaY = 0
          }
        })
        .on('touchend', function(e){
          cancelLongTap()

          // swipe
          if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
              (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {

            if (touch.el) {
              touch.el.trigger('swipe')
              touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            }
            touch = {}

            // normal tap
          } else if ('last' in touch) {
            // don't fire tap when delta position changed by more than 30 pixels,
            // for instance when moving to a point and back to origin
            // 当touch.x2不存在时说明没有touchmove发生，那就应该视为tap
            if (deltaX < 30 && deltaY < 30) {
              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap')
              event.cancelTouch = cancelAll
              // [by paper] fix -> "TypeError: 'undefined' is not an object (evaluating 'touch.el.trigger'), when double tap
              if (touch.el) touch.el.trigger(event)

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if (touch.el) touch.el.trigger('doubleTap')
                touch = {}
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null
                  if (touch.el) touch.el.trigger('singleTap')
                  touch = {}
                }, 250)
              }
            } else {
              touch = {}
            }
          }

          // swipe以后如果只设置touch={}，那么如果用户之后没有再促发touchmove直接做了一次tap操作，deltaX和deltaY并不会更新，还是大于30，导致tap的判断失效，所以这里需要重置
          deltaX = deltaY = 0
        })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
        .on('touchcancel', function(){
          cancelAll();
          deltaX = deltaY = 0
        })

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    //$(window).on('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
        $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
      })
})(Zepto)
