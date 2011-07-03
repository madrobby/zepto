(function($, undefined){

  var supportedTransforms = [
    'scale',     'scaleX',     'scaleY',
    'translate', 'translateX', 'translateY', 'translate3d',
    'skew',      'skewX',      'skewY',
    'rotate',    'rotateX',    'rotateY',    'rotateZ',
    'matrix'
  ];

  $.fn.anim = function(properties, duration, ease, callback){
    var transforms = [], cssProperties = {}, key, that = this;

    for (key in properties) {
      if (supportedTransforms.indexOf(key) !== -1) {

        // Transform rule
        transforms.push(key + '(' + properties[key] + ')');

      } else {
        // CSS property
        cssProperties[key] = properties[key];
      }
    }

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

    return this.css(
      $.extend({
        '-webkit-transition': 'all ' + (duration !== undefined ? duration : 0.5) + 's ' + (ease || ''),
        '-webkit-transform': transforms.join(' ')
      }, cssProperties)
    );
  }

  $.fn.animVarArgs = function(){
    if (arguments.length == 0) return false;
    else var properties = arguments[0];
    var transforms = [], opacity, key, i = 0, args = [.5,'',0];
    if (arguments.length > 1){
      while (typeof arguments[i] != 'function' && i < arguments.length-1) {
        args[i] = arguments[i];
        i += 1;
      }
      if (arguments[i] !== undefined) args.push(arguments[i]);
      else args.push(false);
    }
	
    var duration = args[0], ease = args[1], delay = args[2], callback = args[args.length-1];

    for (key in properties)
      if (key === 'opacity') opacity = properties[key];
      else transforms.push(key + '(' + properties[key] + ')');

    typeof callback == 'function' && this.one('webkitTransitionEnd', callback);

    return this.css({
      '-webkit-transition': 'all ' + duration + 's ' + ease,
      '-webkit-transform': transforms.join(' '),
      '-webkit-transition-delay': delay + 's ',
      opacity: opacity
    });
  }

  $.fn.animAssocArgs = function(){
    if (arguments.length == 0) return false;
    else var properties = arguments[0], transforms = [], opacity, key, duration = .5, ease = '', delay = 0, callback = false;
		
    for (key in properties)
      if (key === 'opacity') opacity = properties[key];
      else transforms.push(key + '(' + properties[key] + ')');

    if (arguments.length>1 && (typeof arguments[1]) != 'function'){
      var options = arguments[1];
      for (key in options)
        switch(key){
          case 'duration': duration = options[key]; break;
          case 'ease': ease = options[key]; break;
          case 'delay': delay = options[key]; break;
        }
      if (arguments[2] !== undefined) callback = arguments[2];
    } else callback = arguments[1];	

    typeof callback == 'function' && this.one('webkitTransitionEnd', callback);

    return this.css({
      '-webkit-transition': 'all ' + duration + 's ' + ease,
      '-webkit-transform': transforms.join(' '),
      '-webkit-transition-delay': delay + 's ',
      opacity: opacity
    });
  }
})(Zepto);

/***********************************
*******        USAGE        *******
************************************

$(element).animVarArgs({
  translate3d: '100px, 100px, 100px',
  opacity: 1
}, 1, 'ease-out', .5, callbackFunction);


$(element).animAssocArgs({
  translate3d: '100px, 100px, 100px',
  opacity: 1
},{
  duration: '1s',
  ease: 'ease-in-out',
  delay: '.5s'
}, callbackFunction);

*/
