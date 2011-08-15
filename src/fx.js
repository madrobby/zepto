//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($, undefined){
  var supportedTransforms = [
    'scale', 'scaleX', 'scaleY',
    'translate', 'translateX', 'translateY', 'translate3d',
    'skew',      'skewX',      'skewY',
    'rotate',    'rotateX',    'rotateY',    'rotateZ',    'rotate3d',
    'matrix'
  ];

  $.fn.anim = function(properties, duration, ease, callback){
    var transforms = [], cssProperties = {}, key, that = this, wrappedCallback, endEventName = 'webkitTransitionEnd';
    if (duration === undefined) duration = 0.5;

    if (typeof properties === 'string') {

      // Keyframe animation

      cssProperties['-webkit-animation-name'] = properties;
      cssProperties['-webkit-animation-duration'] = duration + 's';

      endEventName = 'webkitAnimationEnd';

    } else {

      // CSS / transition animation

      for (key in properties)
        if (supportedTransforms.indexOf(key)>=0)
          transforms.push(key + '(' + properties[key] + ')');
        else
          cssProperties[key] = properties[key];

      if (transforms.length > 0) {
        cssProperties['-webkit-transform'] = transforms.join(' ')
      }

      cssProperties['-webkit-transition'] = 'all ' + duration + 's ' + (ease || '');
    }

    wrappedCallback = function(){
      $(this).css({
        '-webkit-transition': 'none',
        '-webkit-animation-name': 'none'
      });
      callback && callback.call(this);
    }
    if (duration > 0) this.one(endEventName, wrappedCallback);

    setTimeout(function() {
      that.css(cssProperties);
      if (duration <= 0) setTimeout(function() {
        that.each(function(){ wrappedCallback.call(this) });
      }, 0);
    }, 0);

    return this;
  }
})(Zepto);
