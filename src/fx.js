//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = {Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS'},
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;

  function downcase(str) { return str.toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) };

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + downcase(vendor) + '-';
      eventPrefix = event;
      return false;
    }
  });

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  };

  $.fn.animate = function(properties, duration, ease, callback){
    if ($.isObject(duration))
      ease = duration.easing, callback = duration.complete, duration = duration.duration;
    if (duration) duration = duration / 1000;
    return this.anim(properties, duration, ease, callback);
  };

  $.fn.anim = function(properties, duration, ease, callback){
    var transforms, cssProperties = {}, key, that = this, wrappedCallback, endEvent = $.fx.transitionEnd;
    if (duration === undefined) duration = 0.4;
    if ($.fx.off) duration = 0;

    if (typeof properties == 'string') {
      // keyframe animation
      cssProperties[prefix + 'animation-name'] = properties;
      cssProperties[prefix + 'animation-duration'] = duration + 's';
      endEvent = $.fx.animationEnd;
    } else {
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) {
          transforms || (transforms = []);
          transforms.push(key + '(' + properties[key] + ')');
        }
        else cssProperties[key] = properties[key];

      if (transforms) cssProperties[prefix + 'transform'] = transforms.join(' ');
      if (!$.fx.off) cssProperties[prefix + 'transition'] = 'all ' + duration + 's ' + (ease || '');
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return; // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, arguments.callee);
      }
      var props = {};
      props[prefix + 'transition'] = props[prefix + 'animation-name'] = 'none';
      $(this).css(props);
      callback && callback.call(this);
    }
    if (duration > 0) this.bind(endEvent, wrappedCallback);

    setTimeout(function() {
      that.css(cssProperties);
      if (duration <= 0) setTimeout(function() {
        that.each(function(){ wrappedCallback.call(this) });
      }, 0);
    }, 0);

    return this;
  };

  testEl = null;
})(Zepto);
