(function($, undefined){
  $.fn.anim = function(properties, duration, ease, callback){
    var transforms = [], opacity, key, that = this;
    for (key in properties)
      if (key === 'opacity') opacity = properties[key];
      else transforms.push(key + '(' + properties[key] + ')');

    var wrappedCallback = function () {
        that.css( { '-webkit-transition': 'none' } );
        if ( $.isFunction(callback) ) {
            callback();
        }
    };

    if (parseFloat(duration) !== 0) {
      this.one('webkitTransitionEnd', wrappedCallback);
    } else {
      setTimeout(wrappedCallback, 0);
    }

    return this.css({
      '-webkit-transition': 'all ' + (duration !== undefined ? duration : 0.5) + 's ' + (ease || ''),
      '-webkit-transform': transforms.join(' '),
      opacity: opacity
    });
  }
})(Zepto);
