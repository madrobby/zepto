//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// The following code is heavily inspired by jQuery's $.fn.data()

(function($) {
  var data = {}, dataAttr = $.fn.data,
    uuid = $.uuid = +new Date(),
    exp  = $.expando = 'Zepto' + uuid;

  function getData(node, name) {
    var id = node[exp], store = id && data[id];
    return name === undefined ? store || setData(node) :
      (store && store[name]) || dataAttr.call($(node), name);
  }

  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++uuid),
      store = data[id] || (data[id] = {});
    if (name !== undefined) store[name] = value;
    return store;
  };

  function setDataAttributes(node,obj) {
    node.each(function() {
      for (var k in obj) {
        setData(this, k, obj[k]);
      }
    });
  };

  $.fn.data = function(name, value) {
    return value === undefined ?
      this.length == 0 ? undefined : 
      $.isObject(name) ? setDataAttributes(this, name) : getData(this[0], name) :
      this.each(function(idx){
        setData(this, name, $.isFunction(value) ?
                value.call(this, idx, getData(this, name)) : value);
      });
  };
})(Zepto);
