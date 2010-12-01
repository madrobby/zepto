(function($){
  function ajax(o){ // { type, url, data, success, dataType, contentType }
    var data = o.data || null, cb = o.success || null, mime = o.dataType || null, content = o.contentType || null;
    var r = new XMLHttpRequest();
    if (cb instanceof Function) {
      r.onreadystatechange = function(){
        if(r.readyState==4 && (r.status==200 || r.status==0)) {
          if (mime == 'application/json') cb(JSON.parse(r.responseText));
          else cb(r.responseText);
        }
      };
    }
    r.open(o.type || 'GET', o.url || window.location, true);
    if (mime) r.setRequestHeader("Accept", mime );
    if (data instanceof Object) data = JSON.stringify(data), r.setRequestHeader('Content-Type','application/json');
    if (content) r.setRequestHeader('Content-Type',content);
    r.setRequestHeader('X-Requested-With','XMLHttpRequest');
    r.send(data);
  }

  $.get = function(url, success){ ajax({ url: url, success: success }); };
  $.post = function(url, data, success, dataType){
    if (data instanceof Function) dataType = dataType || success, success = data, data = null;
    ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
  };
  $.getJSON = function(url, success){
    ajax({ url: url, success: success, dataType: 'application/json' });
  };

  $.fn.load = function(url, success){
    var self = this, parts = url.split(/\s/), selector;
    if(!this.dom.length) return this;
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
