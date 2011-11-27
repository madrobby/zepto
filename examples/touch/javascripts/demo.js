/* zepto.js demo
 * Simple touch demo that uses the following zepto.js methods:
 * each(), data(), bind(), anim(), attr(), text();
 * Preform the events indicated on the buttons to randomly animate
 * the button and keep track of the amount of times executed by updating it's text.  
 */
$(document).ready(function() {"use strict";
	var $elements = $("#main div:not(.off)"), 
		duration = 2, 
		fx = 'rotate', 
		animObj = {}, 
		count = {};
	$elements.each(function() {
		var $this = $(this),
			eventType = $this.data('type'), 
			transform;
						
		$this.bind(eventType, function() {
			// Randomly select and assign webkit transform for animation 
			transform = ( function(transform) {
				if(transform > 0.5) {
					return (Math.random() > 0.5) ? fx + 'X' : fx + 'Y';
				} else {
					return fx;
				}
			}(Math.random()));
			// Create object to pass to anim()
			animObj[transform] = '360deg';
			$this.anim(animObj, duration, 'linear', function() {
				// Reset the style after the animation
				$this.attr('style', '');
			});
			// Increment count object based on eventType
			if(!count.hasOwnProperty(eventType)) {
				// Create new property initialized at 1
				count[eventType] = 1;
			} else {
				// Increment current eventType
				count[eventType] += 1;
			}
			// Show counter in text
			$this.text(eventType + " " + count[eventType]);
		});
	});
});