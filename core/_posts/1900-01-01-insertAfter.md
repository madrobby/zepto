---
title: insertAfter
signature: |
  insertAfter(target) ⇒ self
---

Insert elements from the current collection after the target element in the
DOM. This is like [after](#after), but with reversed operands.

{% highlight js %}
$('<p>Emphasis mine.</p>').insertAfter('blockquote')
{% endhighlight %}
