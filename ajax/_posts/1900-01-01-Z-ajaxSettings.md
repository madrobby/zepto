---
title: $.ajaxSettings
---

Object containing the default settings for Ajax requests. Most settings are
described in [$.ajax](#$.ajax). The ones that are useful when set globally are:

* `timeout` (default: `0`): set to a non-zero value to specify a default timeout
  for Ajax requests in milliseconds
* `global` (default: true): set to false to prevent firing Ajax events
* `xhr` (default: XMLHttpRequest factory): set to a function that returns
  instances of XMLHttpRequest (or a compatible object)
* `accepts`: MIME types to request from the server for specific `dataType`
  values:
  - script: "text/javascript, application/javascript"
  - json:   "application/json"
  - xml:    "application/xml, text/xml"
  - html:   "text/html"
  - text:   "text/plain"
