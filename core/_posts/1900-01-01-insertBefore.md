---
title: insertBefore
signature: |
  insertBefore(target) ⇒ self
---

Insert element(s) from the current collection before the target element in the
DOM. This is like [before](#before), but with reversed operands.

{% highlight js %}
$('<p>See the following table:</p>').insertBefore('table')
{% endhighlight %}
