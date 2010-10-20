(function($){
  var cache = [], timeout;
  
  $.fn.remove = function(){
    return this.each(function(el){
      if(el.tagName=='IMG'){
        cache.push(el);
        el.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(function(){ cache = [] }, 60000);
      }
      el.parentNode.removeChild(el);
    });
  }  
})(Zepto);
