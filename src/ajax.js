//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var jsonpID = 0,
      isObject = $.isObject,
      key;

  function empty() {}

  $.ajaxJSONP = function(options){
    var jsonpString = 'jsonp' + ++jsonpID,
        script = document.createElement('script');
    window[jsonpString] = function(data){
      options.success(data);
      delete window[jsonpString];
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
    if (settings.data && !settings.contentType) settings.contentType = 'application/x-www-form-urlencoded';
    if (isObject(settings.data)) settings.data = $.param(settings.data);

    if (settings.type.match(/get/i) && settings.data) {
      var queryString = settings.data;
      if (settings.url.match(/\?.*=/)) {
        queryString = '&' + queryString;
      } else if (queryString[0] != '?') {
        queryString = '?' + queryString;
      }
      settings.url += queryString;
    }

    var mime = settings.accepts[settings.dataType],
        xhr = new XMLHttpRequest();

    settings.headers = $.extend({'X-Requested-With': 'XMLHttpRequest'}, settings.headers || {});
    if (mime) settings.headers['Accept'] = mime;

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        var result, error = false;
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
          if (mime == 'application/json' && !(xhr.responseText == '')) {
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

    if (settings.contentType) settings.headers['Content-Type'] = settings.contentType;
    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
    xhr.send(settings.data);

    return xhr;
  };

  // ### $.get
  //
  // Load data from the server using a GET request
  //
  // *Arguments:*
  //
  //     url     — url to which the request is sent
  //     success — callback that is executed if the request succeeds
  //
  // *Example:*
  //
  //     $.get(
  //        '/projects/42',
  //        function (data) {
  //            $('body').append(data);
  //        }
  //     );
  //
  $.get = function(url, success){ $.ajax({ url: url, success: success }) };

  // ### $.post
  //
  // Load data from the server using POST request
  //
  // *Arguments:*
  //
  //     url        — url to which the request is sent
  //     [data]     — data to send to server, can be string or object
  //     [success]  — callback that is executed if the request succeeds
  //     [dataType] — type of expected response
  //                  'json', 'xml', 'html', or 'text'
  //
  // *Example:*
  //
  //     $.post(
  //        '/projects',
  //        { name: 'Zepto.js' },
  //        function (data) {
  //            $('body').append(data);
  //        },
  //        'html'
  //     );
  //
  $.post = function(url, data, success, dataType){
    if ($.isFunction(data)) dataType = dataType || success, success = data, data = null;
    $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
  };

  // Load JSON from the server using GET request
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
    var result = [], add = function(key, value){
      result.push(encodeURIComponent(v ? v + '[' + key + ']' : key)
        + '=' + encodeURIComponent(value));
      },
      isObjArray = $.isArray(obj);

    for(key in obj)
      if(isObject(obj[key]))
        result.push($.param(obj[key], (v ? v + '[' + key + ']' : key)));
      else
        add(isObjArray ? '' : key, obj[key]);

    return result.join('&').replace('%20', '+');
  };
})(Zepto);
