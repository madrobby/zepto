(function($){
  function ajax(method, url, success){
    var r = new XMLHttpRequest();
    r.onreadystatechange = function(){
      if(r.readyState==4 && (r.status==200 || r.status==0))
        success(r.responseText);
    };
    r.open(method,url,true);
    r.setRequestHeader('X-Requested-With','XMLHttpRequest');
    r.send(null);
  }

  $.get = function(url, success){ ajax('GET', url, success); };
  $.post = function(url, success){ ajax('POST', url, success); };
  $.getJSON = function(url, success){
    $.get(url, function(json){ success(JSON.parse(json)) });
  };
  
  $.fn.load = function(url, success){
    var self = this, parts = url.split(/\s/), selector;
    if(!this.length) return this;
    if(parts.length>1) url = parts[0], selector = parts[1];
    $.get(url, function(response){
      self.html(selector ?
        $(document.createElement('div')).html(response).find(selector).html()
        : response);
      success && success();
    });
    return this;
  };
})(Zepto);
