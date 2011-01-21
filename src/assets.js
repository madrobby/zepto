(function($){
  var cache = [], timeout;

  $.fn.remove = function(){
    return this.each(function(){
      if(this.tagName == 'IMG'){
        cache.push(this);
        this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(function(){ cache = [] }, 60000);
      }
      this.parentNode.removeChild(this);
    });
  }
})(Zepto);
