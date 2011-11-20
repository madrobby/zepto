$(document).ready(function() {
    var $elements = $("#main div:not(.off)"),
    	duration = 2,
        fx = ['rotateX', 'rotateY', 'rotate'],
        animateFx = function(opt) {
            var temp = {};
            fx = fx[Math.floor(Math.random() * fx.length)];
            temp[fx] = '360deg';
            return temp;
        },
        testNum = 0,
        count = {};
	
	function action(obj, test) {
		var type = obj.data('type'); 
		switch(test) {
			case 0:
				alert(type);
				break;
			case 1:
				obj.anim(animateFx(), duration, 'linear', function() {
					//obj.attr('style', ''); // Reset?.. No worky.
				});
				break;
			case 2:				
				if(!count.hasOwnProperty(type)){
					count[type] = 1;
				} else {
					count[type] += 1;
				}
				obj.text(type + " " + count[type]);
				break;
			default:
				alert(type);
		}
	}
      
    $(window).bind('hashchange', function(){
    	// Represents the test case in action()
    	testNum = parseInt(location.hash[1], 10);	
    });
       
    $elements.each(function(index) {
        var $this = $(this);
        $this.bind($this.data('type'), function() {
            action($this, testNum);
        });
    });
});