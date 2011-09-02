//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// The following code is heavily inspired by jQuery's $.fn.data()

(function($) {
  var data = {}, dataAttr = $.fn.data;
    uuid = $.uuid = +new Date(),
    exp  = $.expando = 'Zepto' + uuid;

  function getData(node, name) {
    var id = node[exp];
    return ( id && data[id] && data[id][name] ) ?
      data[id][name] : dataAttr.call($(node), name);
  }

  function setData(node, name, value) {
    var id = node[exp] = ++uuid;
    data[id] || (data[id] = {});
    data[id][name] = value;
  };

  $.fn.data = function(name, value) {
    return value === undefined ?
      this.length == 0 ? undefined : getData(this[0], name) :
      this.each(function(idx){
        setData(this, name, $.isFunction(value) ?
                value.call(this, idx, getData(this, name)) : value);
      });
  };
})(Zepto);
