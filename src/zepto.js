var Zepto = (function() {
  var slice = [].slice, key, css, $$, fragmentRE, container, document = window.document, classList, elemDisplay = {}, undefined;

  // fix for iOS 3.2
  if (String.prototype.trim === undefined)
    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') };

  function classRE(name){ return new RegExp("\\s?" + name + "\\s?") }
  function compact(array){ return array.filter(function(item){ return item !== undefined && item !== null }) }
  function flatten(array){ return array.reduce(function(a,b){ return a.concat(b) }, []) }
  function camelize(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function defaultDisplay(nodeName) {
    if (!elemdisplay[nodeName]) {
      var elem = document.createElement(nodeName);
      $(document.body).append(elem);
      var display = getComputedStyle(elem).display;
      $(elem).remove();
      if (display === "none" || display === "") {
        display = "block"
      }
      elemdisplay[nodeName] = display
    }
    return elemdisplay[nodeName]
  }

  fragmentRE = /^\s*<.+>/;
  container = document.createElement("div");
  function fragment(html) {
    container.innerHTML = ('' + html).trim();
    var result = slice.call(container.childNodes);
    container.innerHTML = '';
    return result;
  }

  function Z(dom, selector){
    this.dom = dom || [];
    this.length = this.dom.length;
    this.selector = selector || '';
  }

  function $(selector, context){
    if (selector == document) return new Z;
    else if (context !== undefined) return $(context).find(selector);
    else if (typeof selector === 'function') return $(document).ready(selector);
    else {
      var dom;
      if (selector instanceof Z) dom = selector.dom;
      else if (selector instanceof Array) dom = compact(selector);
      else if (selector instanceof Element || selector === window) dom = [selector];
      else if (fragmentRE.test(selector)) dom = fragment(selector);
      else dom = $$(document, selector);

      return new Z(dom, selector);
    }
  }

  $.extend = function(target, source){ for (key in source) target[key] = source[key]; return target }
  $.qsa = $$ = function(element, selector){ return slice.call(element.querySelectorAll(selector)) }

  $.fn = {
    ready: function(callback){
      document.addEventListener('DOMContentLoaded', callback, false); return this;
    },
    get: function(idx){ return idx === undefined ? this.dom : this.dom[idx] },
    size: function(){ return this.length },
    remove: function(){ return this.each(function(){ this.parentNode.removeChild(this) }) },
    each: function(callback){
      this.dom.forEach(function(el, idx){ callback.call(el, idx, el) });
      return this;
    },
    filter: function(selector){
      return $(this.dom.filter(function(element){
        return $$(element.parentNode, selector).indexOf(element) >= 0;
      }));
    },
    is: function(selector){
      return this.length > 0 && $(this.dom[0]).filter(selector).length > 0;
    },
    first: function(){ return $(this.get(0)) },
    last: function(){ return $(this.get(this.length - 1)) },
    find: function(selector){
      var result;
      if (this.length == 1) result = $$(this.get(0), selector);
      else result = flatten(this.dom.map(function(el){ return $$(el, selector) }));
      return $(result);
    },
    closest: function(selector, context){
      var node = this.dom[0], nodes = $$(context !== undefined ? context : document, selector);
      if (nodes.length === 0) node = null;
      while(node && node !== document && nodes.indexOf(node) < 0) node = node.parentNode;
      return $(node);
    },
    parents: function(selector){
      var ancestors = [], nodes = this.get();
      while (nodes.length > 0)
        nodes = compact(nodes.map(function(node){
          if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
            ancestors.push(node);
            return node;
          }
        }));
      ancestors = $(ancestors);
      return selector === undefined ? ancestors : ancestors.filter(selector);
    },
    parent: function(selector){
      var node, nodes = [];
      this.each(function(){
        if ((node = this.parentNode) && nodes.indexOf(node) < 0) nodes.push(node);
      });
      nodes = $(nodes);
      return selector === undefined ? nodes : nodes.filter(selector);
    },
    pluck: function(property){ return this.dom.map(function(element){ return element[property] }) },
    show: function(){
      return this.each(function(element) {
        element.style.display = element.getAttribute("data-display") || (element.style.display != "none" ? element.style.display : defaultDisplay(element.nodeName));
        element.setAttribute("data-display", element.style.display)
      })
    },
    hide: function(){
      this.each(function(element){
        (element.style.display != "none" && element.style.display) && element.setAttribute("data-display", element.style.display)
      });
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
        (this.length > 0 ? this.dom[0].innerHTML : null) :
        this.each(function(){ this.innerHTML = html });
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this.dom[0].innerText : null) :
        this.each(function(){ this.innerText = text });
    },
    attr: function(name, value){
      return (typeof name == 'string' && value === undefined) ?
        (this.length > 0 && this.dom[0].nodeName === 'INPUT' && this.dom[0].type === 'text' && name === 'value') ? (this.dom[0].value) :
        (this.length > 0 ? this.dom[0].getAttribute(name) || undefined : null) :
        this.each(function(){
          if (typeof name == 'object') for (key in name) this.setAttribute(key, name[key])
          else this.setAttribute(name, value);
        });
    },
    offset: function(){
      var obj = this.dom[0].getBoundingClientRect();
      return {
        left: obj.left + document.body.scrollLeft,
        top: obj.top + document.body.scrollTop,
        width: obj.width,
        height: obj.height
      };
    },
    css: function(property, value){
      if (value === undefined && typeof property == 'string') return this.dom[0].style[camelize(property)];
      css = "";
      for (key in property) css += key + ':' + property[key] + ';';
      if (typeof property == 'string') css = property + ":" + value;
      return this.each(function() { this.style.cssText += ';' + css });
    },
    index: function(element){
      return this.dom.indexOf($(element).get(0));
    },
    hasClass: function(name){
      return classRE(name).test(this.dom[0].className);
    },
    addClass: function(name) {
      return this.each(function(element) {
        classList = [];
        name.split(/\s+/g).forEach(function(klass) {
          if (!$(element).hasClass(klass)) {
            classList.push(klass)
          }
        });
        classList.length && (element.className += (element.className ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name) {
      return this.each(function(element) {
        classList = element.className;
        name.split(/\s+/g).forEach(function(klass) {
          classList = classList.replace(classRE(klass), " ")
        });
        element.className = classList.trim()
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
        return this.each(function(){
          this['insertAdjacent' + (html instanceof Element ? 'Element' : 'HTML')](operator, html);
        });
      };
    })(adjacencyOperators[key]);

  Z.prototype = $.fn;

  return $;
})();

'$' in window || (window.$ = Zepto);
