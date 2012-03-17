//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($, undefined){
  var document = this.document, docElem = document.documentElement,
    origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle,
    speeds = { _default: 400, fast: 200, slow: 600 };

  function translateSpeed(speed) {
    return typeof speed == 'number' ? speed : (speeds[speed] || speeds._default);
  }

  function anim(el, speed, opacity, scale, callback) {
    if (typeof speed == 'function' && !callback) callback = speed, speed = undefined;
    var props = { opacity: opacity };
    if (scale) {
      if ($.fx.transforms3d) props.scale3d = scale + ',1';
      else props.scale = scale;
      el.css($.fx.cssPrefix + 'transform-origin', '0 0');
    }
    return el.anim(props, translateSpeed(speed) * 0.001, null, callback);
  }

  function hide(el, speed, scale, callback) {
    return anim(el, speed, 0, scale, function(){
      origHide.call($(this));
      callback && callback.call(this);
    });
  }

  $.fn.show = function(speed, callback) {
    origShow.call(this);
    speed ? this.css('opacity', 0) : speed = 0;
    return anim(this, speed, 1, '1,1', callback);
  };

  $.fn.hide = function(speed, callback) {
    return speed === undefined ? origHide.call(this) : hide(this, speed, '0,0', callback);
  }

  $.fn.toggle = function(speed, callback) {
    return speed === undefined || typeof speed == 'boolean' ?
      origToggle.call(this, speed) :
      (this[this.css('display') == 'none' ? 'show' : 'hide'](speed, callback));
  };

  $.fn.fadeTo = function(speed, opacity, callback) {
    return anim(this, speed, opacity, null, callback);
  };

  $.fn.fadeIn = function(speed, callback) {
    var target = this.css('opacity')
    target > 0 ? this.css('opacity', 0) : target = 1;
    return origShow.call(this).fadeTo(speed, target, callback);
  };

  $.fn.fadeOut = function(speed, callback) {
    return hide(this, speed, null, callback);
  };

  $.fn.fadeToggle = function(speed, callback) {
    var hidden = this.css('opacity') == 0 || this.css('display') == 'none';
    return this[hidden ? 'fadeIn' : 'fadeOut'](speed, callback);
  };

  $.extend($.fx, {
    speeds: speeds,
    // feature detection for 3D transforms adapted from Modernizr
    transforms3d: (function(props){
      var ret = false;
      $.each(props, function(i, prop){
        if (docElem.style[prop] !== undefined) {
          ret = i != 1 || webkitTransforms3d();
          return false;
        }
      });
      return ret;
    })('perspectiveProperty WebkitPerspective MozPerspective OPerspective msPerspective'.split(' '))
  });

  function webkitTransforms3d() {
    var ret, div = document.createElement('div'),
      testEl = document.createElement('div');

    div.innerHTML += '&shy;<style>@media (-webkit-transform-3d){#zeptotest{left:9px;position:absolute}}</style>';
    testEl.id = 'zeptotest';
    div.appendChild(testEl);
    docElem.appendChild(div);
    ret = testEl.offsetLeft === 9;
    div.parentNode.removeChild(div);
    return ret;
  }
})(Zepto);
