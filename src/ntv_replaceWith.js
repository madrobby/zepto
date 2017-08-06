//  Nativo
//  (c) 2016-2017 Anthony Crawford 
//  Comments with @ symbol and a words adjacent to it will be replaced with the newConent
;(function ($) {
    var document = window.document,
      docElem = document.documentElement,
      nquery = $.nquery,
      originalReplaceWith = $.fn.replaceWith
  $.fn.replaceWith = function (newContent) {
    if (typeof this[0] != "undefined" && this[0].nodeType == 8 && this[0].parentNode instanceof HTMLElement  && /(@[\w]+)/.test(this[0].data)) {
        var parent = this[0].parentNode,
          parentHTML = parent.innerHTML
        parentHTML = parentHTML.replace("<!--" + this[0].data + "-->", newContent)
        parent.innerHTML = parentHTML
        $.fn.traverseNode(parent, $.fn.compileInlineJavaScript)
        return nQuery(parent.ChildNodes)
    } else
      return originalReplaceWith.call(this,newContent)
  }
})(nQuery)