var $ = function(selector){
  $.dom = [].slice.apply(document.querySelectorAll(selector)); return $;
}

$.html = function(html){
  $.dom.forEach(function(el){ el.innerHTML = html }); return $;
}

$.css = function(style){
  $.dom.forEach(function(el){ el.style.cssText += ';'+style }); return $;
}