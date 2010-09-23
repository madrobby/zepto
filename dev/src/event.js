/*
 * zepto.js - event module
 */

zepto.fn.extend({
	
	/**
	 * @param {string} selector
	 * @param {string} eventType
	 * @param {function(this:HTMLElement, Event)} callback
	 * @return {zepto}
	 */
	delegate : function(selector, eventType, callback){
		return this.each(function(elm){
			var 
				root = elm,
				targets = this.find(selector).get();
			
			function delegateHandler(evt){
				var node = evt.target;
				while(node && targets.indexOf(node)<0){
					node = node.parentNode;
				}
				if(node && node !== root){
					callback.call(node, evt);
				}
			}
			
			elm.addEventListener(eventType, delegateHandler, false);
		});
	}
	
});