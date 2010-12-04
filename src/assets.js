(function($){
  var cache = [], timeout;

  $.fn.remove = function(){
    return this.each(function(element){
      if(element.tagName == 'IMG'){
        cache.push(element);
        element.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(function(){ cache = [] }, 60000);
      }
      element.parentNode.removeChild(element);
    });
  }
})(Zepto);
