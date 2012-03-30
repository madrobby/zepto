---
title: insertBefore
signature: |
  insertBefore(target) ⇒ self
---

Insert elements from the current collection before each of the target elements
in the DOM. This is like [before](#before), but with reversed operands.

{% highlight js %}
$('<p>See the following table:</p>').insertBefore('table')
{% endhighlight %}
