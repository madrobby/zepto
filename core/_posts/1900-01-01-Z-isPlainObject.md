---
title: $.isPlainObject
signature: |
  $.isPlainObject(object) ⇒ boolean
---

True if the object is a "plain" JavaScript object;
which is true for object literals and objects created with `new Object` only.

{% highlight js %}
$.isPlainObject({}) // => true
$.isPlainObject(new Object) // => true
$.isPlainObject(new Date) // => false
$.isPlainObject(window) // => false
{% endhighlight %}

