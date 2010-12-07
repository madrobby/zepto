(function($){
  var $$ = $.qsa, handlers = [];

  function find(element, event, fn) {
    return handlers.filter(function(handler){
      return handler && handler.element === element &&
        (!event || handler.event === event) && (!fn || handler.fn === fn);
    });
  }

  $.event = {
    add: function(element, events, fn){
      events.split(/\s/).forEach(function(event){
        var handler = {event: event, element: element, fn: fn, i: handlers.length};
        handlers.push(handler);
        element.addEventListener(event, fn, false);
      });
    },
    remove: function(element, events, fn){
      (events || '').split(/\s/).forEach(function(event){
        find(element, event, fn).forEach(function(handler){
          handlers[handler.i] = null;
          element.removeEventListener(handler.event, handler.fn, false);
        });
      });
    }
  };
  $.fn.bind = function(event, callback){
    return this.each(function(element){
      $.event.add(element, event, callback);
    });
  };
  $.fn.unbind = function(event, callback){
    return this.each(function(element){
      $.event.remove(element, event, callback);
    });
  };
  $.fn.delegate = function(selector, event, callback){
    return this.each(function(element){
      $.event.add(element, event, function(e){
        var target = e.target, nodes = $$(element, selector);
        var proxy = {originalEvent: e, liveFired: element};
        while (target && nodes.indexOf(target) < 0) target = target.parentNode;
        $.extend(proxy, e).currentTarget = target;
        if (target && !(target === element) && !(target === document)) callback.call(target, proxy);
      });
    });
  };
  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback); return this;
  };
  $.fn.trigger = function(event){
    return this.each(function(element){
      var e = document.createEvent('Events');
      element.dispatchEvent(e, e.initEvent(event, true, false));
    });
  };
})(Zepto);
