/*
 * zepto.js - style module
 */
 
zepto.fn.extend({
	
	/**
	 * Set style of matched elements. 
	 * @param {string} style	CSS string.
	 * @return {zepto}
	 */
	css : function(style){
		return this.each(function(el){
			el.style.cssText += ';'+ style; 
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
		return this.css('-webkit-transition:all '+ (duration||0.5) +'s;'+'-webkit-transform:'+ transform +';opacity:'+ (opacity===0?0:opacity||1) );
	}
	
});