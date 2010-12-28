(function($){
  $.fn.anim = function(properties, duration, ease){
    var transforms = [], opacity, key;
    for (key in properties)
      if (key === 'opacity') opacity = properties[key];
      else transforms.push(key + '(' + properties[key] + ')');

    return this.css({
      '-webkit-transition': 'all ' + (duration !== undef ? duration : 0.5) + 's ' + (ease || ''),
      '-moz-transition': 'all ' + (duration !== undef ? duration : 0.5) + 's ' + (ease || ''),
      '-o-transition': 'all ' + (duration !== undef ? duration : 0.5) + 's ' + (ease || ''),
      'transition': 'all ' + (duration !== undef ? durduration : 0.5) + 's ' + (ease || ''),
      '-webkit-transform': transforms.join(' '),
      '-moz-transform': transforms.join(' '),
      '-o-transform': transforms.join(' '),
      'transform': transforms.join(' '),
      opacity: opacity
    });
  }
})(Zepto);
