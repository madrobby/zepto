//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var jsonpID = 0,
      isObject = $.isObject,
      key;

  // Empty function, used as default callback
  function empty() {}

  // ### $.ajaxJSONP
  //
  // Load JSON from a server in a different domain (JSONP)
  //
  // *Arguments:*
  //
  //     options — object that configure the request,
  //               see avaliable options below
  //
  // *Avaliable options:*
  //
  //     url     — url to which the request is sent
  //     success — callback that is executed if the request succeeds
  //     error   — callback that is executed if the server drops error
  //     context — in which context to execute the callbacks in
  //
  // *Example:*
  //
  //     $.ajaxJSONP({
  //        url:     'http://example.com/projects?callback=?',
  //        success: function (data) {
  //            projects.push(json);
  //        }
  //     });
  //
  $.ajaxJSONP = function(options){
    var callbackName = 'jsonp' + (++jsonpID),
      script = document.createElement('script'),
      context = options.context,
      abort = function(){
        $(script).remove();
        if (callbackName in window) window[callbackName] = empty;
      },
      xhr = { abort: abort }, abortTimeout;

    window[callbackName] = function(data){
      clearTimeout(abortTimeout);
      $(script).remove();
      delete window[callbackName];
      options.success.call(context, data);
    };

    script.src = options.url.replace(/=\?/, '=' + callbackName);
    $('head').append(script);

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.abort();
        options.error.call(context, xhr, 'timeout');
      }, options.timeout);

    return xhr;
  };

  // ### $.ajaxSettings
  //
  // AJAX settings
  //
  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest();
    },
    // MIME types mapping
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   'application/json',
      xml:    'application/xml, text/xml',
      html:   'text/html',
      text:   'text/plain'
    },
    // Default timeout
    timeout: 0
  };

  // ### $.ajax
  //
  // Perform AJAX request
  //
  // *Arguments:*
  //
  //     options — object that configure the request,
  //               see avaliable options below
  //
  // *Avaliable options:*
  //
  //     type ('GET')          — type of request GET / POST
  //     url (window.location) — url to which the request is sent
  //     data                  — data to send to server,
  //                             can be string or object
  //     dataType ('json')     — what response type you accept from
  //                             the server:
  //                             'json', 'xml', 'html', or 'text'
  //     timeout (0)           — request timeout
  //     beforeSend            — callback that is executed before
  //                             request send
  //     complete              — callback that is executed on request
  //                             complete (both: error and success)
  //     success               — callback that is executed if
  //                             the request succeeds
  //     error                 — callback that is executed if
  //                             the server drops error
  //     context               — in which context to execute the
  //                             callbacks in
  //
  // *Example:*
  //
  //     $.ajax({
  //        type:       'POST',
  //        url:        '/projects',
  //        data:       { name: 'Zepto.js' },
  //        dataType:   'html',
  //        timeout:    100,
  //        context:    $('body'),
  //        success:    function (data) {
  //            this.append(data);
  //        },
  //        error:    function (xhr, type) {
  //            alert('Error!');
  //        }
  //     });
  //
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
        xhr = $.ajaxSettings.xhr(), abortTimeout,
        context = settings.context;

    settings.headers = $.extend({'X-Requested-With': 'XMLHttpRequest'}, settings.headers || {});
    if (mime) settings.headers['Accept'] = mime;

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        clearTimeout(abortTimeout);
        var result, error = false;
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
          if (mime == 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
            try { result = JSON.parse(xhr.responseText); }
            catch (e) { error = e; }
          }
          else result = xhr.responseText;
          if (error) settings.error.call(context, xhr, 'parsererror', error);
          else settings.success.call(context, result, 'success', xhr);
        } else {
          error = true;
          settings.error.call(context, xhr, 'error');
        }
        settings.complete.call(context, xhr, error ? 'error' : 'success');
      }
    };

    xhr.open(settings.type, settings.url, true);

    if (settings.contentType) settings.headers['Content-Type'] = settings.contentType;
    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);

    if (settings.beforeSend.call(context, xhr, settings) === false) {
      xhr.abort();
      return false;
    }

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty;
        xhr.abort();
        settings.error.call(context, xhr, 'timeout');
      }, settings.timeout);

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
  $.get = function(url, success){ return $.ajax({ url: url, success: success }) };

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
    return $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
  };

  // ### $.getJSON
  //
  // Load JSON from the server using GET request
  //
  // *Arguments:*
  //
  //     url     — url to which the request is sent
  //     success — callback that is executed if the request succeeds
  //
  // *Example:*
  //
  //     $.getJSON(
  //        '/projects/42',
  //        function (json) {
  //            projects.push(json);
  //        }
  //     );
  //
  $.getJSON = function(url, success){
    return $.ajax({ url: url, success: success, dataType: 'json' });
  };

  // ### $.fn.load
  //
  // Load data from the server into an element
  //
  // *Arguments:*
  //
  //     url     — url to which the request is sent
  //     [success] — callback that is executed if the request succeeds
  //
  // *Examples:*
  //
  //     $('#project_container').get(
  //        '/projects/42',
  //        function () {
  //            alert('Project was successfully loaded');
  //        }
  //     );
  //
  //     $('#project_comments').get(
  //        '/projects/42 #comments',
  //        function () {
  //            alert('Comments was successfully loaded');
  //        }
  //     );
  //
  $.fn.load = function(url, success){
    if (!this.length) return this;
    var self = this, parts = url.split(/\s/), selector;
    if (parts.length > 1) url = parts[0], selector = parts[1];
    $.get(url, function(response){
      self.html(selector ?
        $(document.createElement('div')).html(response).find(selector).html()
        : response);
      success && success.call(self);
    });
    return this;
  };

  var escape = encodeURIComponent;

  function serialize(params, obj, traditional, scope){
    var array = $.isArray(obj);
    $.each(obj, function(key, value) {
      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value);
      // recurse into nested objects
      else if (traditional ? $.isArray(value) : isObject(value))
        serialize(params, value, traditional, key);
      else params.add(key, value);
    });
  }

  // ### $.param
  //
  // Encode object as a string of URL-encoded key-value pairs
  //
  // *Arguments:*
  //
  //     obj — object to serialize
  //     [traditional] — perform shallow serialization
  //
  // *Example:*
  //
  //     $.param( { name: 'Zepto.js', version: '0.6' } );
  //
  $.param = function(obj, traditional){
    var params = [];
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) };
    serialize(params, obj, traditional);
    return params.join('&').replace('%20', '+');
  };
})(Zepto);
