---
title: $.isPlainObject
version: 1.0
signature: |
  $.isPlainObject(object) ⇒ boolean
---

True if the object is a "plain" JavaScript object, which is only true for object
literals and objects created with `new Object`.

{% highlight js %}
$.isPlainObject({})         // => true
$.isPlainObject(new Object) // => true
$.isPlainObject(new Date)   // => false
$.isPlainObject(window)     // => false
{% endhighlight %}

