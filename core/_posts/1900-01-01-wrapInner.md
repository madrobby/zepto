---
title: wrapInner
signature: |
  wrapInner(wrappingElement) ⇒ self
---

Wrap an HTML structure around the content of each element in the set of matched
elements. Wrapping element can be any type described in [append](#append).

{% highlight js %}
// wrap the contents of each button in a span:
$('.buttons').wrap('<span></span>')
{% endhighlight %}