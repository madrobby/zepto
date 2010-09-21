var $ = function(_){
  if(typeof _ == 'function') $.dom.forEach(_)
    else $.dom = [].slice.apply(document.querySelectorAll(_));
  return $;
}

$.html = function(html){
  return $(function(el){ el.innerHTML = html });
}

$.append = function(html){
  return $(function(el){ el.insertAdjacentHTML('beforeEnd',html) });
}

$.prepend = function(html){
  return $(function(el){ el.insertAdjacentHTML('afterBegin',html) });
}

$.css = function(style){
  return $(function(el){ el.style.cssText += ';'+style });
}