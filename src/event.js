//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var $$ = $.qsa, handlers = {}, _zid = 1, specialEvents={};

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

  function zid(element) {
    return element._zid || (element._zid = _zid++);
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event);
    if (event.ns) var matcher = matcherFor(event.ns);
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || handler.fn == fn)
        && (!selector || handler.sel == selector);
    });
  }
  function parse(event) {
    var parts = ('' + event).split('.');
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
  }

  function eachEvent(events, fn, iterator){
    if ($.isObject(events)) $.each(events, iterator);
    else events.split(/\s/).forEach(function(type){ iterator(type, fn) });
  }

  function add(element, events, fn, selector, getDelegate, capture){
    capture = !!capture;
    var id = zid(element), set = (handlers[id] || (handlers[id] = []));
    eachEvent(events, fn, function(event, fn){
      var delegate = getDelegate && getDelegate(fn, event),
        callback = delegate || fn;
      var proxyfn = function (event) {
        var result = callback.apply(element, [event].concat(event.data));
        if (result === false) event.preventDefault();
        return result;
      };
      var handler = $.extend(parse(event), {fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length});
      set.push(handler);
      element.addEventListener(handler.e, proxyfn, capture);
    });
  }
  function remove(element, events, fn, selector){
    var id = zid(element);
    eachEvent(events || '', fn, function(event, fn){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i];
        element.removeEventListener(handler.e, handler.proxy, false);
      });
    });
  }

  $.event = { add: add, remove: remove }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback);
    });
  };
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback);
    });
  };
  $.fn.one = function(event, callback){
    return this.each(function(i, element){
      add(this, event, callback, null, function(fn, type){
        return function(){
          var result = fn.apply(element, arguments);
          remove(element, type, fn);
          return result;
        }
      });
    });
  };

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      };
  function createProxy(event) {
    var proxy = $.extend({originalEvent: event}, event);
    $.each(eventMethods, function(name, predicate) {
      proxy[name] = function(){
        this[predicate] = returnTrue;
        return event[name].apply(event, arguments);
      };
      proxy[predicate] = returnFalse;
    })
    return proxy;
  }

  // emulates the 'defaultPrevented' property for browsers that have none
  function fix(event) {
    if (!('defaultPrevented' in event)) {
      event.defaultPrevented = false;
      var prevent = event.preventDefault;
      event.preventDefault = function() {
        this.defaultPrevented = true;
        prevent.call(this);
      }
    }
  }

  $.fn.delegate = function(selector, event, callback){
    var capture = false;
    if(event == 'blur' || event == 'focus'){
      if($.iswebkit)
        event = event == 'blur' ? 'focusout' : event == 'focus' ? 'focusin' : event;
      else
        capture = true;
    }

    return this.each(function(i, element){
      add(element, event, callback, selector, function(fn){
        return function(e){
          var evt, match = $(e.target).closest(selector, element).get(0);
          if (match) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element});
            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
          }
        }
      }, capture);
    });
  };
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector);
    });
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback);
    return this;
  };
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback);
    return this;
  };

  $.fn.on = function(event, selector, callback){
    return selector === undefined || $.isFunction(selector) ?
      this.bind(event, selector) : this.delegate(selector, event, callback);
  };
  $.fn.off = function(event, selector, callback){
    return selector === undefined || $.isFunction(selector) ?
      this.unbind(event, selector) : this.undelegate(selector, event, callback);
  };

  $.fn.trigger = function(event, data){
    if (typeof event == 'string') event = $.Event(event);
    fix(event);
    event.data = data;
    return this.each(function(){ this.dispatchEvent(event) });
  };

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, data){
    var e, result;
    this.each(function(i, element){
      e = createProxy(typeof event == 'string' ? $.Event(event) : event);
      e.data = data; e.target = element;
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e);
        if (e.isImmediatePropagationStopped()) return false;
      });
    });
    return result;
  };

  // shortcut methods for `.bind(event, fn)` for each event type
  ('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback){ return this.bind(event, callback) };
  });

  ['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback);
      else if (this.length) try { this.get(0)[name]() } catch(e){};
      return this;
    };
  });

  $.Event = function(type, props) {
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true;
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
    return event;
  };

})(Zepto);
