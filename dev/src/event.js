/*
 * zepto.js - event module
 */

zepto.fn.extend({
	
	/**
	 * @param {string} eventType	Event type.
	 * @param {function(Event)}	handler	Event handler.
	 */
	bind : function(eventType, handler){
		return this.each(function(el){
			el.addEventListener(eventType, handler, false);
		});
	},
	
	/**
	 * @param {string} eventType	Event type.
	 * @param {function(Event)}	handler	Event handler.
	 */
	unbind : function(eventType, handler){
		return this.each(function(el){
			el.removeEventListener(eventType, handler, false);
		});
	},
	
	/**
	 * @param {string} selector	Selector
	 * @param {string} eventType	Event type that it should listen to. (supports a single kind of event)
	 * @param {function(this:HTMLElement, Event)} callback
	 * @return {zepto}
	 */
	delegate : function(selector, eventType, callback){
		var targets = this.find(selector).get();
		return this.each(function(el){
			function delegateHandler(evt){
				var node = evt.target;
				while(node && targets.indexOf(node)<0){
					node = node.parentNode;
				}
				if(node && node !== el){
					callback.call(node, evt);
				}
			}
			el.addEventListener(eventType, delegateHandler, false);
		});
	}
	
});