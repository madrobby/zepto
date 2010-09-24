/*
 * zepto.js - Element.classList module
 */
 
 /**
  * @param {zepto} zepto
  */
(function(zepto){
	
	//--- As of 2010/09/23 native HTML5 Element.classList is only supported by Firefox 3.6+ ---//
	
	var regexSpaces = /\s+/g,
		regexTrim = /^\s+|\s+$/g;
	
	/**
	 * remove multiple spaces and trailing spaces
	 * @param {string} className
	 * @return {string}
	 */
	function sanitize(className){
		return trim( className.replace(regexSpaces, ' ') );
	}
	
	/**
	 * Remove white spaces from begining and end of string
	 * - as of 2010/09/24 Safari Mobile doesn't support `String.prototype.trim`
	 * @param {string} str
	 */
	function trim(str){
		return str.replace(regexTrim, '');
	}
	
	/**
	 * @param {Element} el
	 * @param {string} className
	 */
	function addClasses(el, className){
		className = el.className +' '+ className; //all classes including repeated ones
		var classesArr = zepto.unique( sanitize(className).split(regexSpaces) ); //avoid adding replicated items
		el.className = classesArr.join(' ');
	}
	
	/**
	 * @param {string} className
	 */
	function createMatchClassRegExp(className){
		return new RegExp('(?:^| )'+ sanitize(className).replace(regexSpaces, '|') +'(?: |$)', 'g'); //match all words contained on `className` string
	}
	
	/**
	 * @param {Element} el
	 * @param {RegExp} regexMatch
	 */
	function removeClasses(el, regexMatch){
		el.className = sanitize(el.className.replace(regexMatch, ' '));
	}
	
	zepto.fn.extend({
		
		/**
		 * Check if any matched element has given class.
		 * @param {string} className
		 * @return {boolean}
		 */
		hasClass : function(className){
			var 
				regexHasClass = createMatchClassRegExp(className),
				n = 0,
				el;
				
			while(el = this[n++]){
				if(el.className.match(regexHasClass)){
					return true
				}
			}
			return false;
		},
		
		/**
		 * Add one or more class(es) into each matched element.
		 * @param {string} className	One or more class names separated by spaces.
		 * @return {zepto}
		 */
		addClass : function(className){
			return this.each(function(el){
				addClasses(el, className);
			});
		},
		
		/**
		 * Remove class(es) from each matched element.
		 * @param {string} [className]	One or more class names separated by spaces, removes all classes if `null`.
		 * @return {zepto}
		 */
		removeClass : function(className){
			className = className || '.+'; //'.+' will match any class name
			var regex = createMatchClassRegExp(className);
			return this.each(function(el){
				removeClasses(el, regex);
			});
		},
		
		/**
		 * Add or remove one or more classes from each element in the set of matched elements.
		 * @param {string} className	One or more class names (separate by space) to be toggled.
		 * @param {boolean} [isAdd]	Switch value, if `true` add class is `false` removes it.
		 * @return {zepto}
		 */
		toggleClass : function(className, isAdd){
			if(zepto.isDef(isAdd)){
				(isAdd)? this.addClass(className) : this.removeClass(className); 
			}else{
				var classes = trim(className).split(' '),
					regex,
					elements = this.get(); //for scope and performance
				classes.forEach(function(c){
					//replicated hasClass and removeClass functionality to avoid creating multiple RegExp objects and also because it needs to toggle classes individually
					regex = createMatchClassRegExp(c);
					elements.forEach(function(el){
						if(el.className.match(regex)){
							removeClasses(el, regex);
						}else{
							addClasses(el, c);
						}
					});
				});
			}
			return this;
		}
	});
	
}(zepto));