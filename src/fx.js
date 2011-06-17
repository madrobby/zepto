(function($, undefined){

  var supportedTransforms = [
    'scale',     'scaleX',     'scaleY',
    'translate', 'translateX', 'translateY', 'translate3d',
    'skew',      'skewX',      'skewY',
    'rotate',    'rotateX',    'rotateY',    'rotateZ',
    'matrix'
  ];

  $.fn.anim = function(properties, duration, ease, callback){
    var transforms = [], cssProperties = {}, key;

    for (key in properties) {
      if (supportedTransforms.indexOf(key) !== -1) {

        // Transform rule
        transforms.push(key + '(' + properties[key] + ')');

      } else {
        // CSS property
        cssProperties[key] = properties[key];
      }
    }

    if (parseFloat(duration) !== 0) {
      $.isFunction(callback) && this.one('webkitTransitionEnd', callback);
    } else {
      setTimeout(callback, 0);
    }

    return this.css(
      $.extend({
        '-webkit-transition': 'all ' + (duration !== undefined ? duration : 0.5) + 's ' + (ease || ''),
        '-webkit-transform': transforms.join(' ')
      }, cssProperties)
    );
  }
})(Zepto);
