/*
 * zepto.js - style module
 */
 
zepto.fn.extend({
	
	/**
	 * Set style of matched elements. 
	 * @param {string} css	CSS string.
	 * @return {zepto}
	 */
	css : function(css){
		return this.each(function(el){
			el.style.cssText += ';'+ css; 
		});
	},
	
	/**
	 * Apply webkit transition to matched elements.
	 * @param {string} transform
	 * @param {number} opacity
	 * @param {number} duration
	 * @return {zepto}
	 */
	anim : function(transform, opacity, duration){
		//TODO: change the way anim works, since it's overwriting the "-webkit-transition:all" it's hard to change other CSS values later without animation.
		return this.css('-webkit-transition:all '+ (duration||0.5) +'s;'+'-webkit-transform:'+ transform +';opacity:'+ (opacity===0?0:opacity||1) );
	}
	
});