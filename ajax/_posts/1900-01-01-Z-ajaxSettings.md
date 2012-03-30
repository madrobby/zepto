---
title: $.ajaxSettings
---

Object containing the default settings for all Ajax requests.

* `type` (default `"GET"`): type of request (`GET` or `POST`)
* `timeout` (default `0`): request timeout in milliseconds, `0` for no timeout
* `context` (default `window`): context to execute callbacks in
* `xhr` (default: return a new XMLHttpRequest instance): override to supply your own XMLHttpRequest (or compatible object) to all Ajax requests
* `global` (default `true`): whether to trigger global Ajax events
* `accepts`: MIME type mapping for the `dataType` option (see below)

Additionally you can specify default callbacks for `beforeSend`, `success`, `error` and `complete`. See <a href="#$.ajax">$.ajax</a> for details on these callbacks.

<h4>MIME types</h4>

The following MIME types are recognized by default:

{% highlight js %}
accepts: {
  script: 'text/javascript, application/javascript',
  json:   'application/json',
  xml:    'application/xml, text/xml',
  html:   'text/html',
  text:   'text/plain'
}
{% endhighlight %}