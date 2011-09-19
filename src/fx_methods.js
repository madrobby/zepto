//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($, undefined){
  var document = window.document, docElem = document.documentElement,
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
    return el.anim(props, translateSpeed(speed) / 1000, null, callback);
  }

  $.fn.show = function(speed, callback) {
    origShow.call(this);
    if (speed !== undefined) {
      this.css('opacity', 0);
      return anim(this, speed, 1, '1,1', callback);
    }
    else return this.css('opacity', 1);
  };

  $.fn.hide = function(speed, callback) {
    if (speed === undefined) return origHide.call(this);
    else return anim(this, speed, 0, '0,0', function(){
      origHide.call($(this));
      callback && callback.call(this);
    });
  }

  $.fn.toggle = function(speed, callback) {
    if (speed === undefined || typeof speed == 'boolean') return origToggle.call(this, speed);
    else return this[this.css('display') == 'none' ? 'show' : 'hide'](speed, callback);
  };

  $.fn.fadeTo = function(speed, opacity, callback) {
    return anim(this, speed, opacity, null, callback);
  };

  $.fn.fadeIn = function(speed, callback) {
    var target = this.css('opacity')
    if (target > 0) this.css('opacity', 0)
    else target = 1
    return origShow.call(this).fadeTo(speed, target, callback);
  };

  $.fn.fadeOut = function(speed, callback) {
    return this.fadeTo(speed, 0, callback);
  };

  $.fn.fadeToggle = function(speed, callback) {
    return this.fadeTo(speed, this.css('opacity') < 1 ? 1 : 0, callback);
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
      testEl = document.createElement('div'),
      css = '@media (-webkit-transform-3d){#zeptotest{left:9px;position:absolute}}',
      style = ['&shy;', '<style>', css, '</style>'].join('');

    div.innerHTML += style;
    testEl.id = 'zeptotest';
    div.appendChild(testEl);
    docElem.appendChild(div);
    ret = testEl.offsetLeft === 9;
    div.parentNode.removeChild(div);
    return ret;
  }
})(Zepto);
