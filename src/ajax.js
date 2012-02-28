//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var jsonpID = 0,
      isObject = $.isObject,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName);
    $(context).trigger(event, data);
    return !event.defaultPrevented;
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data);
  }

  // Number of active Ajax requests
  $.active = 0;

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart');
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop');
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context;
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false;

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
  }
  function ajaxSuccess(data, xhr, settings) {
    var context = settings.context, status = 'success';
    settings.success.call(context, data, status, xhr);
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
    ajaxComplete(status, xhr, settings);
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings) {
    var context = settings.context;
    settings.error.call(context, xhr, type, error);
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);
    ajaxComplete(type, xhr, settings);
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context;
    settings.complete.call(context, xhr, status);
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
    ajaxStop(settings);
  }

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
      abort = function(){
        $(script).remove();
        if (callbackName in window) window[callbackName] = empty;
        ajaxComplete('abort', xhr, options);
      },
      xhr = { abort: abort }, abortTimeout;

    if (options.error) script.onerror = function() {
      xhr.abort();
      options.error();
    };

    window[callbackName] = function(data){
      clearTimeout(abortTimeout);
      $(script).remove();
      delete window[callbackName];
      ajaxSuccess(data, xhr, options);
    };

    script.src = options.url.replace(/=\?/, '=' + callbackName);
    $('head').append(script);

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.abort();
        ajaxComplete('timeout', xhr, options);
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
    // Whether to trigger "global" Ajax events
    global: true,
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
    // Whether the request is to another domain
    crossDomain: false,
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
    var settings = $.extend({}, options || {});
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];

    ajaxStart(settings);

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host;

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
        baseHeaders = { },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = $.ajaxSettings.xhr(), abortTimeout;

    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
    if (mime) baseHeaders['Accept'] = mime;
    settings.headers = $.extend(baseHeaders, settings.headers || {});

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        clearTimeout(abortTimeout);
        var result, error = false;
        if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status == 0 && protocol == 'file:')) {
          if (mime == 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
            try { result = JSON.parse(xhr.responseText); }
            catch (e) { error = e; }
          }
          else result = xhr.responseText;
          if (error) ajaxError(error, 'parsererror', xhr, settings);
          else ajaxSuccess(result, xhr, settings);
        } else {
          ajaxError(null, 'error', xhr, settings);
        }
      }
    };

    var async = 'async' in settings ? settings.async : true;
    xhr.open(settings.type, settings.url, async);

    if (settings.contentType) settings.headers['Content-Type'] = settings.contentType;
    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort();
      return false;
    }

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty;
        xhr.abort();
        ajaxError(null, 'timeout', xhr, settings);
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
        $(document.createElement('div')).html(response.replace(rscript, "")).find(selector).html()
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
