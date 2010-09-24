
/* -- zepto.js : swipe plugin ------------------- */

(function(zepto){
	
	/**
	 * @param {string} direction	Swipe direction ('left', 'right', 'up', 'down')
	 * @param {function({direction: string, changeX: number, changeY: number})} callback
	 * @param {{x: number, y: number}} threshold
	 */
	zepto.fn.swipe = function(direction, callback, threshold){
		
		var thold = {x:30, y:30}, //default threshold
			origin = {x:0, y:0},
			dest = {x:0, y:0},
			isVertical = (direction === 'up' || direction === 'down');
		
		if(threshold) zepto.extend(thold, threshold); //overwrite default threshold
		
		function updateCords(cordsObj, evt){
			cordsObj.x = evt.targetTouches[0].pageX;
			cordsObj.y = evt.targetTouches[0].pageY;
		}
		
		function onTouchStart(evt){
			updateCords(origin, evt);
		}
		
		function onTouchMove(evt){
			evt.preventDefault();
			updateCords(dest, evt);
		}
		
		function onTouchEnd(evt){
			var changeX = origin.x - dest.x,
				changeY = origin.y - dest.y,
				distX = Math.abs(changeX),
				distY = Math.abs(changeY),
				evtInfo = {
					changeX : changeX,
					changeY : changeY,
					direction : direction
				};
			
			if(!isVertical && distX >= thold.x && distY <= thold.y){
				if( (direction === 'left' && changeX > 0) || (direction === 'right' && changeX < 0) ){
					callback.call(evt.currentTarget, evtInfo); //assign `this` to element (used "currentTarget" instead of "target" because of event bubbling)
				}
			}else if(isVertical && distX <= thold.x && distY >= thold.y){
				if( (direction === 'up' && changeY > 0) || (direction === 'down' && changeY < 0) ){
					callback.call(evt.currentTarget, evtInfo); //assign `this` to element (used "currentTarget" instead of "target" because of event bubbling)
				}
			}
		}
		
		this.bind('touchstart', onTouchStart);
		this.bind('touchmove', onTouchMove);
		this.bind('touchend', onTouchEnd);
		//swipe doesn't require 'touchcancel' since 'touchend' won't be called then.
		
		return this; //chain
	};
	
	//create aliases "touchLeft", "touchRight", etc..
	'left right up down'.split(' ').forEach(function(direction){
		zepto.fn['swipe'+ direction.substr(0,1).toUpperCase() + direction.substr(1)] = function(callback, threshold){
			return this.swipe(direction, callback, threshold);
		};
	});
	
}(zepto));