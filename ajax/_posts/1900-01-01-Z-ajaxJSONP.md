---
title: $.ajaxJSONP
signature: |
  $.ajaxJSONP(options) ⇒ mock XMLHttpRequest
---

Perform a [JSONP][] request to another domain. JSONP request are not performed
with XMLHttpRequest, but by injecting a `<script>` to the document.  Most
[$.ajax](#$.ajax) options are supported, with the following considerations:

* `type` is always "GET"
* `url` needs to have the `=?` placeholder
* `contentType`, `dataType`, `headers`, and `async` are not supported.

The `?` placeholder in the URL is replaced with the dynamically generated name
of the callback function for this request. Typically the URL should contain the
query string such as `callback=?`; most servers expect the parameter to be
called like that.

The return value is a mock XMLHttpRequest object that only supports the
`abort()` method.

{% highlight js hl_lines=2 %}
$.ajaxJSONP({
  url: 'http://example.com/projects?callback=?',
  success: function(data){
    // data is a js object, such as Object or Array
  }
})
{% endhighlight %}


  [jsonp]: http://json-p.org
