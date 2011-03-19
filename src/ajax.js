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

  $.ajaxSettings = {
    type: 'GET',
    beforeSend: empty, success: empty, error: empty, complete: empty,
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   'application/json',
      xml:    'application/xml, text/xml',
      html:   'text/html',
      text:   'text/plain'
    }
  };

  $.ajax = function(options){
    options = options || {};
    var settings = $.extend({}, options);
    for (key in $.ajaxSettings) if (!settings[key]) settings[key] = $.ajaxSettings[key];

    if (/=\?/.test(settings.url)) return $.ajaxJSONP(settings);

    if (!settings.url) settings.url = window.location.toString();
    if (settings.data && !settings.contentType) settings.contentType = "application/x-www-form-urlencoded";

    if (settings.type.match(/get/i) && settings.data) {
      var queryString,
          objectType = Object.prototype.toString.call(settings.data).slice(8, -1);
      if (objectType == 'Object' || objectType == 'Array') {
        queryString = $.param(settings.data);
      } else {
        queryString = settings.data;
      }
      if (settings.url.match(/\?.*=/)) {
        queryString = '&' + queryString;
      } else if (queryString.slice(0, 1) !== '?') {
        queryString = '?' + queryString;
      }
      settings.url = settings.url + queryString;
    }

    var mime = settings.accepts[settings.dataType],
        xhr = new XMLHttpRequest();

    settings.headers = $.extend({'X-Requested-With': 'XMLHttpRequest'}, settings.headers || {});
    if (mime) settings.headers['Accept'] = mime;

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        var result, error = false;
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
          if (mime == 'application/json') {
            try { result = JSON.parse(xhr.responseText); }
            catch (e) { error = e; }
          }
          else result = xhr.responseText;
          if (error) settings.error(xhr, 'parsererror', error);
          else settings.success(result, 'success', xhr);
        } else {
          error = true;
          settings.error(xhr, 'error');
        }
        settings.complete(xhr, error ? 'error' : 'success');
      }
    };

    xhr.open(settings.type, settings.url, true);
    if (settings.beforeSend(xhr, settings) === false) {
      xhr.abort();
      return false;
    }
    if (settings.data instanceof Object) settings.data = $.param(settings.data);
    if (settings.contentType) settings.headers['Content-Type'] = settings.contentType;
    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
    xhr.send(settings.data);
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
