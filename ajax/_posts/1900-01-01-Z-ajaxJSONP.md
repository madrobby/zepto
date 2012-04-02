---
title: $.ajaxJSONP
signature: |
  $.ajaxJSONP(options) ⇒ mock XMLHttpRequest
---

Make a <a href="http://en.wikipedia.org/wiki/JSONP">JSONP request</a>. JSONP requests use a `<script>` tag instead of a `XMLHttpRequest` and thus are not subject to the same-origin policy that prevents normal Ajax requests to call remote servers. An alternative to this is <a href="http://en.wikipedia.org/wiki/Cross-origin_resource_sharing">cross-origin remote sharing (CORS)</a>, which is also supported by Zepto.
  
For valid `options`, see <a href="#$.ajax">$.ajax</a> (the `method` and `async` options are not supported on JSONP requests).

The return value is a mock XMLHttpRequest object that only supports the `abort` method.

{% highlight js %}
$.ajaxJSONP({
  url: 'http://example.com/projects?callback=?',
  success: function(data){
    projects.push(json)
  }
})
{% endhighlight %}
