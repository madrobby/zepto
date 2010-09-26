var $ = (function() {
  var slice = [].slice, k, 
    ADJ_OPS = {append: 'beforeEnd', prepend: 'afterBegin', before: 'beforeBegin', after: 'afterEnd'};
  
  function $(_){
    function fn(_){ return arguments.callee.dom.forEach(_), arguments.callee; }
    fn.dom = slice.call(document.querySelectorAll(fn.selector = _));
    for(k in $.fn) fn[k] = $.fn[k];
    return fn;
  }

  $.fn = {
    get: function(idx){ return idx === undefined ? this.dom : this.dom[idx] },
    html: function(html){
      return this(function(el){ el.innerHTML = html });
    },
    css: function(style){
      return this(function(el){ el.style.cssText += ';'+style });
    },
    anim: function(transform, opacity, dur){
      return this.css('-webkit-transition:all '+(dur||0.5)+'s;'+
        '-webkit-transform:'+transform+';opacity:'+(opacity===0?0:opacity||1));
    },
    live: function(event, callback){
      var selector = this.selector;
      document.body.addEventListener(event, function(event){
        var target = event.target, nodes = slice.call(document.querySelectorAll(selector));
        while(target && nodes.indexOf(target)<0) target = target.parentNode;
        if(target && !(target===document)) callback.call(target, event);
      }, false);
      return this;
    }
  };
  
  for(k in ADJ_OPS)
    $.fn[k] = (function(op){ 
      return function(html){ return $(function(el){ el.insertAdjacentHTML(op,html) }) };
    })(ADJ_OPS[k]);
  
  function ajax(method, url, success){
    var r = new XMLHttpRequest();
    r.onreadystatechange = function(){
      if(r.readyState==4 && (r.status==200 || r.status==0))
        success(r.responseText);
    };
    r.open(method,url,true);
    r.send(null);
  }
  
  $.get = function(url, success){ ajax('GET', url, success); };
  $.post = function(url, success){ ajax('POST', url, success); };
  $.getJSON = function(url, success){ 
    $.get(url, function(json){ success(JSON.parse(json)) });
  };

  return $;
})();