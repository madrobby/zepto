;(function ($) {
    var document = window.document,
        key,
        name,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
        //scriptTypeRE = /^(?:text|application)\/javascript/i,
        //xmlTypeRE = /^(?:text|application)\/xml/i,
        //jsonType = 'application/json',
        //htmlType = 'text/html',
        //blankRE = /^\s*$/

    // Number of active Ajax requests
    $.active = 0

    // Empty function, used as default callback
    function empty() {}

    $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Default response type
        responseType: 'text',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        done: empty,
        // Callback that is executed the request fails
        fail: empty,
        // Callback that is executed on request complete (both: error and success)
        always: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport (XHR2)
        xhr: function () {
            return new window.XMLHttpRequest()
        },
        // Request headers
        headers: {},
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true,
        // Whether credential data should be sent with cross-domain requests
        withCredentials: false,
        // The username for same origin requests
        username: null,
        // The password for same origin requests
        password: null
    }

    function appendQuery(url, query) {
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }

    // serialize payload and append it to the URL for GET requests
    // do not serialize if we have an acceptable object type
    function serializeData(options) {
        if (options.data instanceof File ||
            options.data instanceof Blob ||
            options.data instanceof Document ||
            options.data instanceof FormData ||
            options.data instanceof ArrayBuffer)
            return
        if (options.processData && options.data && $.type(options.data) != "string")
            options.data = $.param(options.data, options.traditional)
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
            options.url = appendQuery(options.url, options.data)
    }

    $.ajax = function (options) {
        var settings = $.extend({}, options || {})
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        if (!settings.url) settings.url = window.location.toString()
        serializeData(settings)
        if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

        var baseHeaders = {},
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(),
            abortTimeout

        baseHeaders['X-Requested-With'] = 'XMLHttpRequest'

        settings.headers = $.extend(baseHeaders, settings.headers || {})

        // Create a zepto object from the xhr object
        var zeptoXHR = $(xhr)

        // Add function for upload progress hooking
        zeptoXHR.uploadProgress = function(func){
            if (typeof func !== 'function') throw TypeError('Expected func to be of type function.')
            var callback = func
            var context = settings.context
            $(xhr.upload).on('progress', function(e){
                callback.call(context, e, xhr)
            })

            // Return the zepto object for chaining
            return this
        }

        // Add function for done hooking
        zeptoXHR.done = function(func){
            if (typeof func !== 'function') throw TypeError('Expected func to be of type function.')
            var callback = func
            var context = settings.context
            $(xhr).on('load', function(e){
                if ( !((this.status >= 200 && this.status < 300) || this.status == 304 || (this.status == 0 && protocol == 'file:')) ) {
                    $(this).trigger($.Event('error', e))
                    e.stopImmediatePropagation()
                } else if (this.response == null) {
                    $(this).trigger($.Event('error', e))
                    e.stopImmediatePropagation()
                } else {
                    callback.call(context, this.response, this.statusText, this);
                }
            })

            // Return the zepto object for chaining
            return this
        }

        // Add function for fail hooking
        zeptoXHR.fail = function(func){
            if (typeof func !== 'function') throw TypeError('Expected func to be of type function.')
            var callback = func
            var context = settings.context
            $(xhr).on('error timeout abort', function(e){
                callback.call(context, e.type, this, settings)
            })

            // Return the zepto object for chaining
            return this
        }

        // Add function for always hooking
        zeptoXHR.always = function(func){
            if (typeof func !== 'function') throw TypeError('Expected func to be of type function.')
            var callback = func
            var context = settings.context
            $(xhr).on('loadend', function(e){
                callback.call(context, this, settings)
            })

            // Return the zepto object for chaining
            return this
        }
        
        // If settings.global is set to true then hook in global ajax events
        if (settings.global){
            zeptoXHR.on('beforesend', function(e){
                $(settings.context || document).trigger($.Event('ajaxBeforeSend'), [this, settings])
            })

            zeptoXHR.on('loadstart', function(e){
                $(settings.context || document).trigger($.Event('ajaxStart'), [this, settings])
            })

            zeptoXHR.on('load', function(e){
                if ( !((this.status >= 200 && this.status < 300) || this.status == 304 || (this.status == 0 && protocol == 'file:')) ) {
                    $(this).trigger($.Event('error', e))
                    e.stopImmediatePropagation()
                } else if (this.response == null) {
                    $(this).trigger($.Event('error', e))
                    e.stopImmediatePropagation()
                } else {
                    $(settings.context || document).trigger($.Event('ajaxSuccess'), [this, settings, this.response])
                }
            })

            zeptoXHR.on('error timeout abort', function(e){
                $(settings.context || document).trigger($.Event('ajaxError'), [this, settings, e.type])
            })

            zeptoXHR.on('loadend', function(e){
                $(settings.context || document).trigger($.Event('ajaxStop'), [this, settings])
            })
        }

        // Hook active request count
        zeptoXHR.on('loadstart', function(){
            $.active++
        })
        zeptoXHR.on('loadend', function(){
            $.active--
        })

        // Hook beforeSend
        zeptoXHR.on('beforesend', function(){
            settings.beforeSend.call(settings.context, xhr, settings)
        })

        // Now hook in done, fail and always functions
        zeptoXHR.done(settings.done)
        zeptoXHR.fail(settings.fail)
        zeptoXHR.always(settings.always)

        xhr.open(settings.type, settings.url, true, settings.username, settings.password)

        // Set xhr fields
        xhr.withCredentials = settings.withCredentials
        xhr.responseType = settings.responseType
        xhr.timeout = settings.timeout

        // Add headers
        for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

        // Trigger beforeSend and check to make sure the request wasn't canceled
        var beforeSendEvent = $.Event('beforesend')
        zeptoXHR.trigger(beforeSendEvent)
        if (beforeSendEvent.defaultPrevented === true) {
            xhr.abort()
            return false
        }

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return zeptoXHR
    }

    // handle optional data/success arguments
    function parseArguments(url, data, success, dataType) {
        var hasData = !$.isFunction(data)
        return {
            url: url,
            data: hasData ? data : undefined,
            success: !hasData ? data : $.isFunction(success) ? success : undefined,
            dataType: hasData ? dataType || success : success
        }
    }

    $.get = function (url, data, success, dataType) {
        return $.ajax(parseArguments.apply(null, arguments))
    }

    $.post = function (url, data, success, dataType) {
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
    }

    $.getJSON = function (url, data, success) {
        var options = parseArguments.apply(null, arguments)
        options.dataType = 'json'
        return $.ajax(options)
    }

    $.fn.load = function (url, data, success) {
        if (!this.length) return this
        var self = this,
            parts = url.split(/\s/),
            selector,
            options = parseArguments(url, data, success),
            callback = options.success
        if (parts.length > 1) options.url = parts[0], selector = parts[1]
        options.success = function (response) {
            self.html(selector ?
                $('<div>').html(response.replace(rscript, "")).find(selector) : response)
            callback && callback.apply(self, arguments)
        }
        $.ajax(options)
        return this
    }

    var escape = encodeURIComponent

    function serialize(params, obj, traditional, scope) {
        var type, array = $.isArray(obj)
            $.each(obj, function (key, value) {
                type = $.type(value)
                if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
                // handle data in serializeArray() format
                if (!scope && array) params.add(value.name, value.value)
                // recurse into nested objects
                else if (type == "array" || (!traditional && type == "object"))
                    serialize(params, value, traditional, key)
                else params.add(key, value)
            })
    }

    $.param = function (obj, traditional) {
        var params = []
        params.add = function (k, v) {
            this.push(escape(k) + '=' + escape(v))
        }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
    }
})(Zepto)