var $ = function(selector){
  $.dom = [].slice.apply(document.querySelectorAll(selector)); return $;
}

$.html = function(html){
  $.dom.forEach(function(el){ el.innerHTML = html }); return $;
}

$.append = function(html){
  $.dom.forEach(function(el){ el.insertAdjacentHTML('beforeEnd',html) }); return $;
}

$.prepend = function(html){
  $.dom.forEach(function(el){ el.insertAdjacentHTML('afterBegin',html) }); return $;
}

$.css = function(style){
  $.dom.forEach(function(el){ el.style.cssText += ';'+style }); return $;
}