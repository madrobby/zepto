---
title: toggleClass
signature: |
  toggleClass(name, [setting]) ⇒ self
  toggleClass(function(index, oldClassName){ ... }, [setting]) ⇒ self
---

Toggle given class name in each element in the collection. The class name is
removed if present; otherwise it's added. If `setting` is present, this method
behaves like [addClass](#addClass) if setting is truthy or
[removeClass](#removeClass) otherwise.
