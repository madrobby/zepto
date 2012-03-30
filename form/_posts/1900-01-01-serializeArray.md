---
title: serializeArray
signature: |
  serializeArray() ⇒ array
---

Serialize form into an array of Objects with `name` and `value` properties. It
skips disabled form controls, buttons, and unchecked radio buttons/checkboxes.
The result doesn't include data from file inputs.

{% highlight js %}
$('form').serializeArray()
//=> [{ name: 'size', value: 'micro' },
//    { name: 'name', value: 'Zepto' }]
{% endhighlight %}
