(function($){
  $.fn.anim = function(properties, duration, ease, delay, callback){
    var transforms = [], opacity, key;
    for (key in properties)
      if (key === 'opacity') opacity = properties[key];
      else transforms.push(key + '(' + properties[key] + ')');

    typeof callback == 'function' && this.one('webkitTransitionEnd', callback);

    return this.css({
      '-webkit-transition': 'all ' + (duration !== undefined ? duration : 0.5) + 's ' + (ease || ''),
      '-webkit-transform': transforms.join(' '),
      '-webkit-transition-delay': (delay !== undefined ? delay : 0)+'s ',
      opacity: opacity
    });
  }
})(Zepto);
