//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// The following code is heavily inspired by jQuery's $.fn.data()

;(function($) {
  var data = {}, dataAttr = $.fn.data,
    uuid = $.uuid = +new Date(),
    exp  = $.expando = 'Zepto' + uuid

  function getData(node, name) {
    var id = node[exp], store = id && data[id]
    return name === undefined ? store || setData(node) :
      (store && store[name]) || dataAttr.call($(node), name)
  }

  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++uuid),
      store = data[id] || (data[id] = {})
    if (name !== undefined) store[name] = value
    else {
      var i, l, attributes = node.attributes;
      for (i = 0, l = attributes.length; i < l; i++) {
        name = attributes[i].name
        if ( name.indexOf('data-') === 0 ) store[name.substring(5)] = attributes[i].value
      }
    }
    return store
  }

  function setDataAttributes(node, object) {
    node.each(function(){ for (var key in object) setData(this, key, object[key]) })
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      this.length == 0 ? undefined :
      $.isPlainObject(name) ? setDataAttributes(this, name) : getData(this[0], name) :
      this.each(function(idx){ setData(this, name, value) })
  }
})(Zepto)
