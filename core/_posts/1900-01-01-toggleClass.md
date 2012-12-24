---
title: toggleClass
signature: |
  toggleClass(names, [setting]) ⇒ self
  toggleClass(function(index, oldClassNames){ ... }, [setting]) ⇒ self
---

Toggle given class names (space-separated) in each element in the collection.
The class name is removed if present on an element; otherwise it's added. If
`setting` is present, this method behaves like [addClass](#addClass) if setting
is truthy or [removeClass](#removeClass) otherwise.
