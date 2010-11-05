(function($){
  function ajax(method, url, data, success){
    var r = new XMLHttpRequest();
    r.onreadystatechange = function(){ if(r.readyState==4 && (r.status==200 || r.status==0)) success(r.responseText) };
    r.open(method,url,true);
    r.setRequestHeader('X-Requested-With','XMLHttpRequest');
    if (method=='POST') r.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    r.send(data);
  }
  $.get = function(url, success){ ajax('GET', url, null, success); };
  $.getJSON = function(url, success){ $.get(url, function(json){ success(JSON.parse(json)) }) };
  $.post = function(url, data, success){ ajax('POST', url, data, success); };
  $.fn.load = function(url, success){
    var self = this, parts = url.split(/\s/), selector;
    if(!this.length) return this;
    if(parts.length>1) url = parts[0], selector = parts[1];
    $.get(url, function(response){
      self.html(selector ? $(document.createElement('div')).html(response).find(selector).html() : response);
      success && success();
    });
    return this;
  };
})(Zepto);
