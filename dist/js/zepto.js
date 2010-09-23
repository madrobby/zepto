/**
 * @license zepto.js v0.1.3
 * - original by Thomas Fuchs (http://github.com/madrobby/zepto), forked by Miller Medeiros (http://github.com/millermedeiros/zepto).
 * Released under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * Build: 8 - Date: 09/23/2010 04:21 PM
 */
 
(function(window, document){
	
	/**
	 * zepto.js
	 * @constructor
	 * @namespace
	 * @param {string|zepto|HTMLElement} [selector]
	 * @param {HTMLElement|Document|zepto} [context]
	 */
	var zepto = function(selector, context){
		if(this instanceof zepto){ //enforce `new` on constructor (scope-safe).
			context = context || document;
			
			var	matched;
			
			//inspired by jQuery.init method (highly simplified)
			if(selector){
				
				if(selector.nodeType){ //DOMElement
					context = selector;
					matched = [selector];
					selector = null;
				}else if(selector instanceof zepto){ //zepto object
					selector = selector.selector;
					context = selector.context;
				}
				
				if(context instanceof zepto){
					matched = [];
					context.each(function(el){
						matched = matched.concat( zepto.makeArray(el.querySelectorAll(selector)) );
					});
					matched = zepto.unique(matched);
				}else if(! matched){ //avoid querySelector if `selector` is a DOMElement
					matched = zepto.makeArray( context.querySelectorAll(selector) );
				}
			}
			
			this.selector = selector;
			this.context = context;
			this.add(matched);
			
		}else{
			return new zepto(selector, context);
		}
	}
	
	/**
	 * zepto.js
	 * @constructor
	 * @namespace
	 * @param {string|zepto|HTMLElement} [selector]
	 * @param {HTMLElement|Document|zepto} [context]
	 */
	window.zepto = window.$ = zepto; //export '$' and 'zepto' to global scope
	
	
	/**
	 * @namespace reference to zepto.prototype for easy plugin developement
	 */
	zepto.fn = zepto.prototype = {
		
		/**
		 * Execute a function for each matched element.
		 * @param {function(this:zepto, HTMLElement)} fn
		 * @return {zepto}
		 */
		each : function(fn){
			this.get().forEach(function(el){
				fn.call(this, el); //bind `this` to zepto object
			}, this);
			return this;
		},
		
		/**
		 * Find descendant node based on selector.
		 * @param {string} selector
		 * @return {zepto}
		 */
		find : function(selector){
			return zepto(selector, this);
		},
		
		/**
		 * Retrieve matched DOM elements.
		 * @param {number} [index]	Element index
		 * @return {Array|HTMLElement} All matched elements if `index` is `undefined` or a single element if `index` is specified.
		 */
		get : function(index){
			return zepto.isDef(index)? this[parseInt(index, 10)] : zepto.makeArray(this);
		},
		
		/**
		 * Reduce matched elements to a single element by index.
		 * @param {number} index Element Index
		 * @return {zepto}
		 */
		eq : function(index){
			return zepto(this.get(index));
		},
		
		/**
		 * Add a set of elements to the stack. 
		 * @param {Array} elements	Selector string or Elements to be added to current stack.
		 */
		add : function(elements){
			Array.prototype.push.apply(this, elements); //copy reference of elements to $[n] and update length (convert `zepto` into a pseudo-array object)
			return this;
		},
		
		/**
		 * Pass each element in the current matched set through a function, producing a new zepto object containing the return values. 
		 * @param {function(this:Element, number, Element):*} callback	Function that will be called for each element.
		 */
		map : function(callback){
			return zepto().add(zepto.map(this, function(el, i){
				return callback.call(el, i, el);
			}));
		}
		
	};
	
	//------------------------------ Helpers ------------------------------//
	
	/**
	 * Copy properties from one Object into another (mixin).
	 * - will extend `zepto` or `zepto.fn` by default if `second` is `undefined`.
	 * @param {Object} first
	 * @param {Object} [second]
	 * @return {Object}
	 */
	zepto.extend = zepto.fn.extend = function(first, second){
		var key;
		if(! second){ //extend zepto by default
			second = first;
			first = this;
		}
		for(key in second){
			if(second.hasOwnProperty(key)){ //avoid copying properties from prototype and makes JSLint happy! :)
				first[key] = second[key];
			}
		}
		return first;
	};
	
	//generics (static methods)
	zepto.extend({
	
		/**
		 * Return Array without any duplicate items.
		 * @param {Array} array
		 * @return {Array}
		 */
		unique : function(array){
			function unique(item, i, arr){
				return arr.indexOf(item) === i;
			}
			return array.filter(unique);
		},
		
		/**
		 * Convert Array-like object into a true Array
		 * @param {Array} obj
		 * @return {Array}
		 */
		makeArray : function(obj){
			return Array.prototype.slice.call(obj);
		},
		
		/**
		 * Check if parameter is different than `undefined`.
		 * @return {boolean} `true` if parameter isn't `undefined`.
		 */
		isDef : function(param){
			return (typeof param !== 'undefined');
		},
		
		/**
		 * Translate all items in an array or array-like object to another array of items.
		 * - similar to `jQuery.map` and not to `Array.prototype.map`
		 * @param {Array} target	Array or Array-like Object to be mapped.
		 * @param {function(*, number, Array): *} callback	Function called for each item on the array passing "item" as first parameter and "index" as second parameter and "base array" as 3rd, if callback returns any value besides `null` will add value to "mapped" array.  
		 */
		map : function(target, callback){
			//didn't used `Array.prototype.map` because `jQuery.map` works different than JavaScript 1.6 `Array.map`
			var ret = [],
				value,
				i,
				n = target.length;
			for(i = 0; i < n; i++){
				value = callback(target[i], i);
				if(value != null){
					ret[ret.length] = value; //faster than push
				}
			}
			return ret;
		}
		
	});
	
}(window, document));
/*
 * zepto.js - HTML manipulation module
 */
 
zepto.fn.extend({
		
	/**
	 * Get/Set elements innerHTML.
	 * @param {string} [html]
	 * @return {zepto|string}
	 */
	html : function(html){
		if(zepto.isDef(html)){
			return this.each(function(el){ 
				el.innerHTML = html;
			});
		}else{
			return this.get(0).innerHTML;
		}
	},
	
	/**
	 * Insert HTML text at specified position.
	 * @param {string} position	['beforeEnd', 'afterBegin', 'beforeBegin', 'afterEnd']
	 * @param {string} html
	 */
	insertAdjacentHTML : function(position, html){
		return this.each(function(el){
			el.insertAdjacentHTML(position, html); 
		});
	},
	
	/**
	 * Insert HTML text before end of element.
	 * @param {string} html
	 * @return {zepto}
	 */
	append : function(html){
		return this.insertAdjacentHTML('beforeEnd', html);
	},
	
	/**
	 * Insert HTML text after begin of element.
	 * @param {string} html
	 * @return {zepto}
	 */
	prepend : function(html){
		return this.insertAdjacentHTML('afterBegin', html);
	},
	
	/**
	 * Insert HTML text before element.
	 * @param {string} html
	 * @return {zepto}
	 */
	before : function(html){
		return this.insertAdjacentHTML('beforeBegin', html);
	},
	
	/**
	 * Insert HTML text after element.
	 * @param {string} html
	 * @return {zepto}
	 */
	after : function(html){
		return this.insertAdjacentHTML('afterEnd', html);
	}
	
});
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
				targets = this.find(selector).matched;
			
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
/*
 * zepto.js - ajax module
 */

//static methods
zepto.extend({

	/**
	 * XML Http Request
	 * @param {string} method	Request Method
	 * @param {string} url	Request URL
	 * @param {Function} [success]	Success Callback
	 * @param {Function} [error]	Error Callback
	 * @return {zepto}
	 */
	ajax : function(method, url, success, error){
		var xhr = new XMLHttpRequest();
		
		function xhrStateHandler(){
			if(xhr.readyState == 4){
				if(xhr.status == 200 && success){
					success(xhr.responseText);
				}else if(error){
					error(xhr.status, xhr.statusText);
				}
				xhr.removeEventLister('readystatechange', xhrStateHandler);
			}
		}
		
		if(success || error){ //only attach listener if required
			xhr.addEventLister('readystatechange', xhrStateHandler, false);
		}
		
		xhr.open(method, url, true);
		xhr.send(null);
		
		return this;
	},
	
	/**
	 * Ajax GET
	 * @param {string} url	Request URL
	 * @param {Function} [success]	Success Callback
	 * @param {Function} [error]	Error Callback
	 * @return {zepto}
	 */
	get : function(url, success, error){
		return zepto.ajax('GET', url, success, error);
	},
	
	/**
	 * Ajax POST
	 * @param {string} url	Request URL
	 * @param {Function} [success]	Success Callback
	 * @param {Function} [error]	Error Callback
	 * @return {zepto}
	 */
	post : function(url, success, error){
		return zepto.ajax('POST', url, success, error);
	},
	
	/**
	 * Ajax GET with pre-built JSON.parse 
	 * @param {string} url	Request URL
	 * @param {Function} [success]	Success Callback
	 * @param {Function} [error]	Error Callback
	 * @return {zepto}
	 */
	getJSON : function(url, success, error){
		return zepto.get(url, function(data){
			success(JSON.parse(data));
		}, error);
	}

});
/*
 * zepto.js - Element.classList module
 */
 
 /**
  * @param {zepto} zepto
  */
(function(zepto){
	
	//--- As of 2010/09/23 native HTML5 Element.classList is only supported by Firefox 3.6+ ---//
	
	var regexSpaces = /\s+/g;
	
	/**
	 * remove multiple spaces and trailing spaces
	 * @param {string} className
	 * @return {string}
	 */
	function sanitize(className){
		return className.replace(regexSpaces, ' ').trim();
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
				var classes = className.trim().split(' '),
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
