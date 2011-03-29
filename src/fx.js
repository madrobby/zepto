(function($, undefined){
  $.fn.anim = function(properties, duration, ease, callback){
    var transforms = [], opacity, key;
    for (key in properties)
      if (key === 'opacity') opacity = properties[key];
      else transforms.push(key + '(' + properties[key] + ')');

<<<<<<< HEAD
    typeof callback === 'function' && this.one('webkitTransitionEnd', callback, false);
=======
    $.isFunction(callback) && this.one('webkitTransitionEnd', callback);
>>>>>>> 79dd84c1f08e453d298c066138a9f9c07ae646ca

    return this.css({
      '-webkit-transition': 'all ' + (duration !== undefined ? duration : 0.5) + 's ' + (ease || ''),
      '-webkit-transform': transforms.join(' '),
      opacity: opacity
    });
  }
})(Zepto);
