---
title: $.isWindow
version: 1.0
signature: |
  $.isWindow(object) ⇒ boolean
---

True if the object is a window object. This is useful for iframes where each one
has its own window, and where these objects fail the regular `obj === window`
check.
