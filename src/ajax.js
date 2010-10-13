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
  
  $.fn.load = function(url, selector, success) {   // some functionality and methods inspired from jQuery source (MIT Licensed)
    var that = this;
    if (!this.length) return this;
    if (Object.prototype.toString.call(selector) === "[object Function]") { // if 2nd arg exists and is function
      success = selector;
      selector = null;
    };
    $.get(url, function(data) {
      var resp = data.replace(/<script(.|\s)*?\/script>/gi, '');
      that.html(
        selector ?
          $(document.createElement('div')).html(resp).find(selector).html()
          : resp );
      if (success) success();
    });
    return this;
  };
  
})(Zepto);