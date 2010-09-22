var $ = (function() {
  var slice = [].slice, k, 
    ADJ_OPS = {append: 'beforeEnd', prepend: 'afterBegin', before: 'beforeBegin', after: 'afterEnd'};
  
  function $(_){
    if(typeof _ == 'function') $.dom.forEach(_)
    else
      $.dom = slice.call(document.querySelectorAll($._ = _));
    return $.fn;
  }

  $.fn = {
    get: function(idx){ return idx === undefined ? $.dom : $.dom[idx] },
    html: function(html){
      return $(function(el){ el.innerHTML = html });
    },
    css: function(style){
      return $(function(el){ el.style.cssText += ';'+style });
    },
    anim: function(transform, opacity, dur){
      return $.fn.css('-webkit-transition:all '+(dur||0.5)+'s;'+
        '-webkit-transform:'+transform+';opacity:'+(opacity===0?0:opacity||1));
    },
    live: function(event, callback){
      var selector = $._;
      document.body.addEventListener(event, function(event){
        var target = event.target, nodes = slice.call(document.querySelectorAll(selector));
        while(target && nodes.indexOf(target)<0) target = target.parentNode;
        if(target && !(target===document)) callback.call(target, event);
      }, false);
      return $.fn;
    }
  };
  
  for(k in ADJ_OPS)
    $.fn[k] = (function(op){ 
      return function(html){ return $(function(el){ el.insertAdjacentHTML(op,html) }) };
    })(ADJ_OPS[k]);
  
  function ajax(method, url, success){
    var r = new XMLHttpRequest();
    r.onreadystatechange = function(){
      if(r.readyState==4 && r.status==200) 
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