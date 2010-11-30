(function($){
  var d=document, $$=$.qsa, handlers=[];
  function find(el, ev, fn) {
    return handlers.filter(function(handler){
      return handler && handler.el===el && (!ev || handler.ev===ev) && (!fn || handler.fn===fn);
    });
  }
  $.event = {
    add: function(el, events, fn){
      events.split(/\s/).forEach(function(ev){
        var handler = {ev: ev, el: el, fn: fn, i: handlers.length};
        handlers.push(handler);
        el.addEventListener(ev, fn, false);
      });
    },
    remove: function(el, events, fn){
      (events||'').split(/\s/).forEach(function(ev){
        find(el, ev, fn).forEach(function(handler){
          handlers[handler.i] = null;
          el.removeEventListener(handler.ev, handler.fn, false);
        });
      });
    }
  };
  $.fn.bind = function(event, callback){
    return this.each(function(el){ $.event.add(el, event, callback) });
  };
  $.fn.unbind = function(event, callback){
    return this.each(function(el){ $.event.remove(el, event, callback) });
  };
  $.fn.delegate = function(selector, event, callback){
    return this.each(function(el){
      $.event.add(el, event, function(event){
        var target = event.target, nodes = $$(el, selector);
        while(target && nodes.indexOf(target)<0) target = target.parentNode;
        if(target && !(target===el) && !(target===d)) callback.call(target, event);
      }, false);
    });
  };
  $.fn.live = function(event, callback){
    $(d.body).delegate(this.selector, event, callback); return this;
  };
  $.fn.trigger = function(event){
    return this.each(function(el){ var e; el.dispatchEvent(e = d.createEvent('Events'), e.initEvent(event, true, false)) });
  };
})(Zepto);
