---
title: prependTo
signature: |
  prependTo(target) ⇒ self
---

Prepend elements in the current collection inside the target element(s). This is
like [prepend](#prepend), only with reversed operands.

{% highlight js %}
$('<li>first list item</li>').prependTo('ul')
{% endhighlight %}
