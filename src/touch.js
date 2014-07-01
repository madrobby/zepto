//     Zepto.js
//     (c) 2010-2014 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
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
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  function isPrimaryTouch(event){
    return (event.pointerType == 'touch' ||
      event.pointerType == event.MSPOINTER_TYPE_TOUCH)
      && event.isPrimary
  }

  function isPointerEventType(e, type){
    return (e.type == 'pointer'+type ||
      e.type.toLowerCase() == 'mspointer'+type)
  }

  $(document).ready(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

    var isScrollingFlag = 0, timer, v = 0, currentUid = 0, lastTouchMoveScrollTop, lastTouchMoveTime, scrollDomMap = {}, parentScrollTopMap = {};

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
      .on('touchstart MSPointerDown pointerdown', function(e){
        // fix for ios
        if($.os.ios){
            // generate an unique random id
            currentUid = Math.random();

            // clear last interval
            clearInterval(timer);

            // record all parents' scrollTop for checking scroll DOM element
            var currEl = e.target;
            var parent = currEl;

            while(parent){
                if(parent.id){
                }else{
                    parent.id = "zepto_" + (new Date());
                }

                parentScrollTopMap[parent.id] = $(parent).scrollTop();

                parent = parent.parentNode;
            }

        }

        if((_isPointerType = isPointerEventType(e, 'down')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
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
        if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
      })
      .on('touchmove MSPointerMove pointermove', function(e){
        if((_isPointerType = isPointerEventType(e, 'move')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        cancelLongTap()
        touch.x2 = firstTouch.pageX
        touch.y2 = firstTouch.pageY

        deltaX += Math.abs(touch.x1 - touch.x2)
        deltaY += Math.abs(touch.y1 - touch.y2)

        // when touch move, we can check which dom is scrolling
        if($.os.ios){

            // if checked for this time, then do nothing
            if(scrollDomMap[currentUid]){
            }else{
                var el = e.target;
                var parent = el;

                // check parents' scrollTop to indentify the scroll element
                while(parent){
                    if(Math.abs($(parent).scrollTop() - parentScrollTopMap[parent.id || " "]) > 0){
                        scrollDomMap[currentUid] = parent;

                        break;
                    }else{
                        parent = parent.parentNode;
                    }
                }
            }

            // record the last scrollTop for calculating the velocity
            if(scrollDomMap[currentUid]){

                var scrollEl = scrollDomMap[currentUid];
                lastTouchMoveScrollTop = $(scrollEl).scrollTop();
                lastTouchMoveTime = + new Date();
            }
        }
      })
      .on('touchend MSPointerUp pointerup', function(e){
        if((_isPointerType = isPointerEventType(e, 'up')) &&
          !isPrimaryTouch(e)) return
        cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)){

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

            if($.os.ios){
              if(scrollDomMap[currentUid]){

                  var scrollEl = scrollDomMap[currentUid];

                  lastScrollTop = $(scrollEl).scrollTop();

                  // calculate the velocity 
                  var time = + new Date();
                  var dt = (time - lastTouchMoveTime);

                  v = (lastScrollTop - lastTouchMoveScrollTop) / dt;

                  // if velocity > 0.5, we believe that the scroll element will continue scroll
                  // and at the same time we can't get the correct scrollTop using js
                  // when it's stopped, scrollTop will be set correct immediately
                  if(Math.abs(v) > 0.5){
                      timer = setInterval(function(){
                        var scrollTop = $(scrollEl).scrollTop();

                        // if current scrollTop always equals to lastScrollTop, scroll element now is scrolling.
                        if(lastScrollTop == scrollTop){
                            isScrollingFlag = 1;

                        // else it's stopped
                        }else{
                            isScrollingFlag = 0;

                            clearInterval(timer);
                        }
                      }, 20);
                  }else{
                      isScrollingFlag = 0;
                  }
              }else{
              }
          }

        // normal tap
        }else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
            // if the scroll dom is scrolling, 
            // the first tap is to stop scrolling rather than trigger tap events
            if($.os.ios && isScrollingFlag) {
                isScrollingFlag = 0;
                return;
            }else{

            };

              var event = $.Event('tap')
              event.cancelTouch = cancelAll
              touch.el.trigger(event)

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
            }, 0)
          } else {
            touch = {}
          }
          deltaX = deltaY = 0

      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel pointercancel', cancelAll)

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  })
})(Zepto)
