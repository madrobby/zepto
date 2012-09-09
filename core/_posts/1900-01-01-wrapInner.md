---
title: wrapInner
signature: |
  wrapInner(structure) ⇒ self
  wrapInner(function(index){ ... }) ⇒ self [v1.0]
---

Wrap the _contents_ of each element separately in a structure. Structure can be
a single element or several nested elements, and can be passed in as a HTML string
or DOM node, or as a function that is called for each element and returns one of
the first two types.

{% highlight js %}
// wrap the contents of each navigation link in a span:
$('nav a').wrapInner('<span>')

// wrap the contents of each list item in a paragraph and emphasis:
$('ol li').wrapInner('<p><em /></p>')
{% endhighlight %}
