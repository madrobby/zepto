(function($){
  var jsonpID = 0;

  function empty() {}

  $.ajaxJSONP = function(options){
    var jsonpString = 'jsonp' + ++jsonpID,
        script = document.createElement('script');
    window[jsonpString] = function(data){
      options.success(data);
      delete window.jsonpString;
    };
    script.src = options.url.replace(/=\?/, '=' + jsonpString);
    $('head').append(script);
  };

  $.ajax = function(options){
    // { type, url, data, success, dataType, contentType }
    options = options || {};

    if (options.url && /=\?/.test(options.url))
      return $.ajaxJSONP(options);

    var data = options.data,
        callback = options.success || empty,
        errback = options.error || empty,
        mime = mimeTypes[options.dataType],
        type = options.type || "GET",
        content = options.contentType || (type === "POST" ? "application/x-www-form-urlencoded" : ""),
        xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
          if (mime == 'application/json') {
            var result, error = false;
            try {
              result = JSON.parse(xhr.responseText);
            } catch (e) {
              error = e;
            }
            if (error) errback(xhr, 'parsererror', error);
            else callback(result, 'success', xhr);
          } else callback(xhr.responseText, 'success', xhr);
        } else {
          errback(xhr, 'error');
        }
      }
    };

    xhr.open(type, options.url || window.location, true);
    if (mime) xhr.setRequestHeader('Accept', mime);
    if (data instanceof Object) data = $.param(data);
    if (content) xhr.setRequestHeader('Content-Type', content);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(data);
  };

  var mimeTypes = $.ajax.mimeTypes = {
    json: 'application/json',
    xml:  'application/xml',
    html: 'text/html',
    text: 'text/plain'
  };

  $.get = function(url, success){ $.ajax({ url: url, success: success }) };
  $.post = function(url, data, success, dataType){
    if (data instanceof Function) dataType = dataType || success, success = data, data = null;
    $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
  };
  $.getJSON = function(url, success){ $.ajax({ url: url, success: success, dataType: 'json' }) };

  $.fn.load = function(url, success){
    if (!this.length) return this;
    var self = this, parts = url.split(/\s/), selector;
    if (parts.length > 1) url = parts[0], selector = parts[1];
    $.get(url, function(response){
      self.html(selector ?
        $(document.createElement('div')).html(response).find(selector).html()
        : response);
      success && success();
    });
    return this;
  };

  $.param = function(obj, v){
    var s = [],
        rec = '',
        add = function(key, value){
          if(v) s[s.length] = encodeURIComponent(v + "[" + key +"]") + '=' + encodeURIComponent(value);
          else s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        };
    for(var i in obj){
      if(obj[i] instanceof Array || obj[i] instanceof Object)
        rec += (s.length + rec.length > 0 ? '&' : '') + $.param(obj[i], (v ? v + "[" + i + "]" : i));
      else
        add(obj instanceof Array ? '' : i, obj[i]);
    };
    return s.join("&").replace(/%20/g, "+") + rec;
  };
})(Zepto);
