---
title: prependTo
signature: |
  prependTo(target) ⇒ self
---

Prepend elements of the current collection inside each of the target elements. This is
like [prepend](#prepend), only with reversed operands.

{% highlight js %}
$('<li>first list item</li>').prependTo('ul')
{% endhighlight %}
