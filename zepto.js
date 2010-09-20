var $ = function(selector){
  return { dom: Array.prototype.slice.apply(document.querySelectorAll(selector)), 
    anim: $.anim, css: $.css, html: $.html };
}

$.html = function(html){
  this.dom.forEach(function(el){ el.innerHTML = html }); return this;
}

$.css = function(style){
  this.dom.forEach(function(el){ el.style.cssText += ';'+style }); return this;
}