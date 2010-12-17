var Zepto = (function() {
  var slice = [].slice, key, css, $$, fragmentRE, container, document = window.document, undefined;

  // fix for iOS 3.2
  if (String.prototype.trim === undefined)
    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') };

  function classRE(name){ return new RegExp("(^|\\s)" + name + "(\\s|$)") }
  function compact(array){ return array.filter(function(item){ return item !== undefined && item !== null }) }
  function camelize(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }

  fragmentRE = /^\s*<.+>/;
  container = document.createElement("div");
  function fragment(html) {
    container.innerHTML = ('' + html).trim();
    var result = slice.call(container.childNodes);
    container.innerHTML = '';
    return result;
  }

  function Z(dom, selector){ this.dom = dom || []; this.selector = selector || '' }

  function $(selector, context){
    if (selector == document) return new Z;
    else if (context !== undefined) return $(context).find(selector);
    else if (typeof selector === 'function') return $(document).ready(selector);
    else {
      var dom;
      if (selector instanceof Z) dom = selector.dom;
      else if (selector instanceof Array) dom = selector;
      else if (selector instanceof Element || selector === window) dom = [selector];
      else if (fragmentRE.test(selector)) dom = fragment(selector);
      else dom = $$(document, selector);

      return new Z(compact(dom), selector);
    }
  }

  $.extend = function(target, source){ for (key in source) target[key] = source[key]; return target }
  $.qsa = $$ = function(element, selector){ return slice.call(element.querySelectorAll(selector)) }

  $.fn = {
    ready: function(callback){
      document.addEventListener('DOMContentLoaded', callback, false); return this;
    },
    compact: function(){ this.dom = compact(this.dom); return this },
    get: function(idx){ return idx === undefined ? this.dom : this.dom[idx] },
    remove: function(){
      return this.each(function(el){ el.parentNode.removeChild(el) });
    },
    each: function(callback){ this.dom.forEach(callback); return this },
    filter: function(selector){
      return $(this.dom.filter(function(element){
        return $$(element.parentNode, selector).indexOf(element) >= 0;
      }));
    },
    is: function(selector){
      return this.dom.length > 0 && $(this.dom[0]).filter(selector).dom.length > 0;
    },
    first: function(callback){ this.dom = compact([this.dom[0]]); return this },
    last: function() { this.dom = compact([this.dom[this.dom.length - 1]]); return this },
    find: function(selector){
      return $(this.dom.map(function(el){ return $$(el, selector) }).reduce(function(a,b){ return a.concat(b) }, []));
    },
    closest: function(selector){
      var node = this.dom[0].parentNode, nodes = $$(document, selector);
      while(node && nodes.indexOf(node) < 0) node = node.parentNode;
      return $(node && !(node === document) ? node : []);
    },
    pluck: function(property){ return this.dom.map(function(element){ return element[property] }) },
    show: function(){ return this.css('display', 'block') },
    hide: function(){ return this.css('display', 'none') },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === undefined ?
        (this.dom.length > 0 ? this.dom[0].innerHTML : null) :
        this.each(function(element){ element.innerHTML = html });
    },
    text: function(text){
      return text === undefined ?
        (this.dom.length > 0 ? this.dom[0].innerText : null) :
        this.each(function(element){ element.innerText = text });
    },
    attr: function(name, value){
      return (typeof name == 'string' && value === undefined) ?
        (this.dom.length > 0 && this.dom[0].nodeName === 'INPUT' && this.dom[0].type === 'text' && name === 'value') ? (this.dom[0].value) :
        (this.dom.length > 0 ? this.dom[0].getAttribute(name) || undefined : null) :
        this.each(function(element){
          if (typeof name == 'object') for (key in name) element.setAttribute(key, name[key])
          else element.setAttribute(name, value);
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
      return this.each(function(element) { element.style.cssText += ';' + css });
    },
    index: function(element){
      return this.dom.indexOf($(element).get(0));
    },
    hasClass: function(name){
      return classRE(name).test(this.dom[0].className);
    },
    addClass: function(name){
      return this.each(function(element){
        !$(element).hasClass(name) && (element.className += (element.className ? ' ' : '') + name)
      });
    },
    removeClass: function(name){
      return this.each(function(element){
        element.className = element.className.replace(classRE(name), ' ').trim()
      });
    },
    toggleClass: function(name, when){
      return this.each(function(element){
       ((when !== undefined && !when) || $(element).hasClass(name)) ?
         $(element).removeClass(name) : $(element).addClass(name)
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
        return this.each(function(element){
          element['insertAdjacent' + (html instanceof Element ? 'Element' : 'HTML')](operator, html);
        });
      };
    })(adjacencyOperators[key]);

  Z.prototype = $.fn;

  return $;
})();

'$' in window || (window.$ = Zepto);
