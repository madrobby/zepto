var Zepto = (function() {
  var slice = [].slice, key, css, $$, fragmentRE, container, document = window.document, undefined,
    classList, elemDisplay = {},
    getComputedStyle = document.defaultView.getComputedStyle;

  function classRE(name){ return new RegExp('(^|\\s)' + name + '(\\s|$)') }
  function compact(array){ return array.filter(function(item){ return item !== undefined && item !== null }) }
  function flatten(array){ return [].concat.apply([], array); }
  function camelize(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function defaultDisplay(nodeName) {
    if (!elemDisplay[nodeName]) {
      var elem = document.createElement(nodeName);
      document.body.insertAdjacentElement("beforeEnd", elem);
      var display = getComputedStyle(elem, '').getPropertyValue("display");
      elem.parentNode.removeChild(elem);
      display == "none" && (display = "block");
      elemDisplay[nodeName] = display
    }
    return elemDisplay[nodeName]
  }
  function uniq(array){
    var r = [];
    for(var i=0,n=array.length;i<n;i++)
      if(r.indexOf(array[i])<0) r.push(array[i]);
    return r;
  }
  function isF(value) { return ({}).toString.call(value) == "[object Function]" }
  function isO(value) { return value instanceof Object }
  function isA(value) { return value instanceof Array }

  fragmentRE = /^\s*<[^>]+>/;
  container = document.createElement('div');
  function fragment(html) {
    container.innerHTML = ('' + html).trim();
    var result = slice.call(container.childNodes);
    container.innerHTML = '';
    return result;
  }

  function Z(dom, selector){
    dom = dom || [];
    dom.__proto__ = Z.prototype;
    dom.selector = selector || '';
    return dom;
  }

  function $(selector, context){
    if (!selector) return Z();
    if (context !== undefined) return $(context).find(selector);
    else if (isF(selector)) return $(document).ready(selector);
    else if (selector instanceof Z) return selector;
    else {
      var dom;
      if (isA(selector)) dom = compact(selector);
      else if (selector instanceof Element || selector === window || selector === document)
        dom = [selector], selector = null;
      else if (fragmentRE.test(selector)) dom = fragment(selector);
      else dom = $$(document, selector);
      return Z(dom, selector);
    }
  }

  $.extend = function(target, source){ for (key in source) target[key] = source[key]; return target }
  $.qsa = $$ = function(element, selector){ return slice.call(element.querySelectorAll(selector)) }

  function filtered(nodes, selector){
    return selector === undefined ? $(nodes) : $(nodes).filter(selector);
  }

  $.isFunction = isF;
  $.isObject = isO;
  $.isArray = isA;

  $.fn = {
    forEach: [].forEach,
    map: [].map,
    reduce: [].reduce,
    push: [].push,
    indexOf: [].indexOf,
    concat: [].concat,
    ready: function(callback){
      document.addEventListener('DOMContentLoaded', callback, false); return this;
    },
    get: function(idx){ return idx === undefined ? this : this[idx] },
    size: function(){ return this.length },
    remove: function(){ return this.each(function(){ this.parentNode.removeChild(this) }) },
    each: function(callback){
      this.forEach(function(el, idx){ callback.call(el, idx, el) });
      return this;
    },
    filter: function(selector){
      return $([].filter.call(this, function(element){
        return $$(element.parentNode, selector).indexOf(element) >= 0;
      }));
    },
    is: function(selector){
      return this.length > 0 && $(this[0]).filter(selector).length > 0;
    },
    not: function(selector){
      var nodes=[];
      if (isF(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this);
        });
      else {
        var ignores = slice.call(
          typeof selector == 'string' ?
            this.filter(selector) :
            selector instanceof NodeList ? selector : $(selector));
        slice.call(this).forEach(function(el){
          if (ignores.indexOf(el) < 0) nodes.push(el);
        });
      }
      return $(nodes);
    },
    eq: function(idx){ return $(this[idx]) },
    first: function(){ return $(this[0]) },
    last: function(){ return $(this[this.length - 1]) },
    find: function(selector){
      var result;
      if (this.length == 1) result = $$(this[0], selector);
      else result = flatten(this.map(function(el){ return $$(el, selector) }));
      return $(result);
    },
    closest: function(selector, context){
      var node = this[0], nodes = $$(context !== undefined ? context : document, selector);
      if (nodes.length === 0) node = null;
      while(node && node !== document && nodes.indexOf(node) < 0) node = node.parentNode;
      return $(node !== document && node);
    },
    parents: function(selector){
      var ancestors = [], nodes = this;
      while (nodes.length > 0)
        nodes = compact(nodes.map(function(node){
          if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
            ancestors.push(node);
            return node;
          }
        }));
      return filtered(ancestors, selector);
    },
    parent: function(selector){
      return filtered(uniq(compact(this.pluck('parentNode'))), selector);
    },
    children: function(selector){
      return filtered(flatten(this.map(function(el){ return slice.call(el.children) })), selector);
    },
    siblings: function(selector){
      return filtered(flatten(this.map(function(el){
        return slice.call(el.parentNode.children).filter(function(child){ return child!==el });
      })), selector);
    },
    pluck: function(property){ return this.map(function(element){ return element[property] }) },
    show: function(){
      return this.each(function() {
        this.style.display == "none" && (this.style.display = null);
        if (getComputedStyle(this, '').getPropertyValue("display") == "none") {
          this.style.display = defaultDisplay(this.nodeName)
        }
      })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(){
      this.css("display") == "none" && this.show() || this.hide();
      return this
    },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){ this.innerHTML = isF(html) ? html.call(this, idx, this.innerHTML) : html });
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].innerText : null) :
        this.each(function(){ this.innerText = text });
    },
    attr: function(name, value){
      return (typeof name == 'string' && value === undefined) ?
        (this.length > 0 && this[0].nodeName == 'INPUT' && this[0].type == 'text' && name == 'value') ? (this.val()) :
        (this.length > 0 ? this[0].getAttribute(name) || (name in this[0] ? this[0][name] : undefined) : null) :
        this.each(function(idx){
          if (isO(name)) for (key in name) this.setAttribute(key, name[key])
          else this.setAttribute(name, isF(value) ? value.call(this, idx, this.getAttribute(name)) : value);
        });
    },
    removeAttr: function(name) {
      return this.each(function() { this.removeAttribute(name); });
    },
    data: function(name, value){
      return this.attr('data-' + name, value);
    },
    val: function(value){
      return (value === undefined) ?
        (this.length > 0 ? this[0].value : null) :
        this.each(function(){
          this.value = value;
        });
    },
    offset: function(){
      var obj = this[0].getBoundingClientRect();
      return {
        left: obj.left + document.body.scrollLeft,
        top: obj.top + document.body.scrollTop,
        width: obj.width,
        height: obj.height
      };
    },
    css: function(property, value){
      if (value === undefined && typeof property == 'string')
        return this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property);
      css = '';
      for (key in property) css += key + ':' + property[key] + ';';
      if (typeof property == 'string') css = property + ':' + value;
      return this.each(function() { this.style.cssText += ';' + css });
    },
    index: function(element){
      return this.indexOf($(element)[0]);
    },
    hasClass: function(name){
      return classRE(name).test(this[0].className);
    },
    addClass: function(name){
      return this.each(function() {
        classList = [];
        name.split(/\s+/g).forEach(function(klass) {
          if (!$(this).hasClass(klass)) {
            classList.push(klass)
          }
        }, this);
        classList.length && (this.className += (this.className ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function() {
        classList = this.className;
        name.split(/\s+/g).forEach(function(klass) {
          classList = classList.replace(classRE(klass), " ")
        });
        this.className = classList.trim()
      })
    },
    toggleClass: function(name, when){
      return this.each(function(){
       ((when !== undefined && !when) || $(this).hasClass(name)) ?
         $(this).removeClass(name) : $(this).addClass(name)
      });
    }
  };

  ['width', 'height'].forEach(function(property){
    $.fn[property] = function(){ return this.offset()[property] }
  });


  var adjacencyOperators = {append: 'beforeEnd', prepend: 'afterBegin', before: 'beforeBegin', after: 'afterEnd'};

  for (key in adjacencyOperators)
    $.fn[key] = (function(operator) {
      return function(html){
        return this.each(function(index, element){
          if (html instanceof Z) {
            dom = html;
            if (operator == 'afterBegin' || operator == 'afterEnd')
              for (var i=0; i<dom.length; i++) element['insertAdjacentElement'](operator, dom[dom.length-i-1]);
            else
              for (var i=0; i<dom.length; i++) element['insertAdjacentElement'](operator, dom[i]);
          } else {
            element['insertAdjacent'+(html instanceof Element ? 'Element' : 'HTML')](operator, html);
          }
        });
      };
    })(adjacencyOperators[key]);

  Z.prototype = $.fn;

  return $;
})();

'$' in window || (window.$ = Zepto);
