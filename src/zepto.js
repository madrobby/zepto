var Zepto = (function() {
  var slice=[].slice, d=document,
    CN="className", AEL="addEventListener", PN="parentNode", IO="indexOf",
    IH="innerHTML", SA="setAttribute",
    ADJ_OPS={append: 'beforeEnd', prepend: 'afterBegin', before: 'beforeBegin', after: 'afterEnd'},
    e, k;

  function $$(el, selector){ return slice.call(el.querySelectorAll(selector)) }
  function classRE(name){ return new RegExp("(^|\\s)"+name+"(\\s|$)") }

  function $(_, context){
    if(context !== void 0) return $(context).find(_);
    function fn(_){ return fn.dom.forEach(_), fn }
    fn.dom = ((typeof _ == 'function' && 'dom' in _) ? 
      _.dom : (_ instanceof Array ? _ : 
        (_ instanceof Element ? [_] : 
          $$(d, fn.selector = _)))).filter(function(el){ 
            return el !== void 0 && el !== null 
          });
    for(k in $.fn) fn[k] = $.fn[k];
    return fn;
  }

  $.fn = {
    compact: function(){ return $(this.dom) },
    get: function(idx){ return idx === void 0 ? this.dom : this.dom[idx] },
    remove: function(){
      return this(function(el){ el[PN].removeChild(el) });
    },
    each: function(callback){ return this(callback) },
    find: function(selector){
      return $(this.dom.map(function(el){ return $$(el, selector) }).reduce(function(a,b){ return a.concat(b) }, []));
    },
    closest: function(selector){
      var el = this.dom[0][PN], nodes = $$(d, selector);
      while(el && nodes[IO](el)<0) el = el[PN];
      return $(el && !(el===d) ? el : []);
    },
    pluck: function(property){ return this.dom.map(function(el){ return el[property] }) },
    show: function(){ return this.css('display', 'block') },
    hide: function(){ return this.css('display', 'none') },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === void 0 ? (this.dom.length>0 ? this.dom[0][IH] : null) : this(function(el){ el[IH] = html });
    },
    attr: function(name,value){
      return (typeof name == 'string' && value === void 0) ? (this.dom.length>0 ? this.dom[0].getAttribute(name) || undefined : null) :
        this(function(el){
          if (typeof name == 'object') for(k in name) el[SA](k, name[k])
          else el[SA](name,value);
        });
    },
    offset: function(){
      var obj = this.dom[0].getBoundingClientRect();
      return { left: obj.left+d.body.scrollLeft, top: obj.top+d.body.scrollTop, width: obj.width, height: obj.height };
    },
    css: function(prop, value){
      return (arguments.length == 1) ? this.dom[0].style[prop] : this(function(el) { el.style[prop] = value; });
    },
    index: function(el){
      return this.dom[IO]($(el).get(0));
    },
    anim: function(transform, opacity, dur){
      return this.css('-webkit-transition:all '+(dur||0.5)+'s;'+
        '-webkit-transform:'+transform+';opacity:'+(opacity===0?0:opacity||1));
    },
    bind: function(event, callback){
      return this(function(el){
        event.split(/\s/).forEach(function(event){ el[AEL](event, callback, false); });
      });
    },
    delegate: function(selector, event, callback){
      return this(function(el){
        el[AEL](event, function(event){
          var target = event.target, nodes = $$(el, selector);
          while(target && nodes[IO](target)<0) target = target[PN];
          if(target && !(target===el) && !(target===d)) callback.call(target, event);
        }, false);
      });
    },
    addClass: function(name){
      return this(function(el){
        !classRE(name).test(el[CN]) && (el[CN] += (el[CN] ? ' ' : '') + name);
      });
    },
    removeClass: function(name){
      return this(function(el){
        el[CN] = el[CN].replace(classRE(name), ' ').replace(/^\s+|\s+$/g, '');
      });
    },
    trigger: function(event){
      return this(function(el){ var e; el.dispatchEvent(e = d.createEvent('Events'), e.initEvent(event, true, false)) });
    }
  };
  
  ['width','height'].forEach(function(m){ $.fn[m] = function(){ return this.offset()[m] }});

  for(k in ADJ_OPS)
    $.fn[k] = (function(op){
      return function(html){ return this(function(el){
        el['insertAdjacent' + (html instanceof Element ? 'Element' : 'HTML')](op,html)
      })};
    })(ADJ_OPS[k]);

  return $;
})();

'$' in window||(window.$=Zepto);