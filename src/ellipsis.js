;(function($, undefined){
	function ellipsis($elem, options) {
        var max = options.maxWidth,
    		ellipsis_char = options.ellipsisChar;
        if (!max) {
            max = $elem.width();
        }
        max = max * options.maxLine;
        var text = $.trim($elem.text());
        var $temp_elem = $elem.clone()
            .css({ "visibility": "hidden", "whiteSpace": "nowrap","width":"auto", "position":"absolute" })
            .appendTo(document.body);
        var width = $temp_elem.width();
		if(width > max){
			var stop =  Math.floor(text.length * max / width); // for performance while content exceeding the limit substantially
			var temp_str = text.substring(0,stop) + ellipsis_char;
			width = $temp_elem.text(temp_str).width();
			if(width > max){
				while (width > max && stop > 1) {
					stop--;
					temp_str = text.substring(0, stop) + ellipsis_char;
					width = $temp_elem.text(temp_str).width();
				}
			}
			else if(width < max){
				while (width < max && stop < text.length) {
					stop++;
					temp_str = text.substring(0, stop) + ellipsis_char;
					width = $temp_elem.text(temp_str).width();
				}
				if(width > max){
					temp_str = text.substring(0,stop -1)+ellipsis_char;
				}
			}
			temp_str = text.substring(0, stop- Math.round(options.maxLine/2)) + ellipsis_char;//fix white-space bug
			$elem.text(temp_str);
		}
        $temp_elem.remove();
    }
    var defaults = {
        maxWidth: 0,
        maxLine: 1,
		ellipsisChar:'...'
    };
    $.fn.ellipsis = function (options) {
        return this.each(function () {
            var $elem = $(this);
            var opts = $.extend({}, defaults, options);
            ellipsis($elem, opts);
        });
    };
    $.fn.ellipsis.options = defaults;
    $.ellipsis = function(elem, options){
        if (typeof elem == 'string') {
    	    $(elem).ellipsis(options);
        }else{
            $.each(elem, function(index, item){
                $(item).ellipsis(options);
            });
        }
    }
})(Zepto);