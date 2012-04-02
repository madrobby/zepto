---
title: serializeArray
signature: |
  serializeArray() ⇒ array
---

Serialize form into an array of objects with `name` and `value` properties.
Disabled form controls, buttons, and unchecked radio buttons/checkboxes are skipped.
The result doesn't include data from file inputs.

{% highlight js %}
$('form').serializeArray()
//=> [{ name: 'size', value: 'micro' },
//    { name: 'name', value: 'Zepto' }]
{% endhighlight %}
