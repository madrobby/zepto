---
title: "$.camelCase"
version: 1.0
signature: |
  $.camelCase(string) ⇒ string
---

Turn a dasherized string into "camel case". Doesn't affect already camel-cased
strings.

{% highlight js %}
$.camelCase('hello-there') //=> "helloThere"
$.camelCase('helloThere')  //=> "helloThere"
{% endhighlight %}
