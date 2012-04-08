;(function($){
  var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches

  function visible(elem){
    elem = $(elem)
    return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
  }

  // Implements a subset from:
  // http://api.jquery.com/category/selectors/jquery-selector-extensions/
  //
  // Complex selectors are not supported:
  //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
  //   "> h2"
  //   ul.inner:first > li
  var filters = {
    visible: function(){ return visible(this) },
    hidden: function(){ return !visible(this) },
    selected: function(){ return this.selected },
    checked: function(){ return this.checked },
    first: function(idx){ return idx === 0 },
    eq: function(idx, value){ return idx === value },
    contains: function(idx, text){ return $(this).text().indexOf(text) > -1 },
    has: function(idx, sel){ return zepto.qsa(this, sel).length }
  }

  var re = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*')

  function process(sel, fn) {
    var filter, arg, match = sel.match(re)
    if (match && match[2] in filters) {
      var filter = filters[match[2]], arg = match[3]
      sel = match[1]
      if (arg) {
        var num = Number(arg)
        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
        else arg = num
      }
    }
    return fn(sel, filter, arg)
  }

  zepto.qsa = function(node, selector) {
    return process(selector, function(sel, filter, arg){
      try {
        if (!sel && filter) sel = '*'
        var nodes = oldQsa(node, sel)
      } catch(e) {
        console.error('error performing selector: %o', selector)
        throw e
      }
      return !filter ? nodes : nodes.filter(function(el, i){ return filter.call(el, i, arg) })
    })
  }

  zepto.matches = function(node, selector){
    return process(selector, function(sel, filter, arg){
      return (!sel || oldMatches(node, sel)) &&
        (!filter || filter.call(node, null, arg))
    })
  }
})(Zepto)
