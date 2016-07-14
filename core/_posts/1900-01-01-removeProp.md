---
title: removeProp
version: 1.2
signature: |
  removeProp(name) ⇒ self
---

Remove a property from each of the DOM nodes in the collection. This is done
with JavaScript's `delete` operator. Note that trying to remove some built-in
DOM properties such as `className` or `maxLength` won't have any affect, since
browsers disallow removing those properties.
