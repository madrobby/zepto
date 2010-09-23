/**
 * @license zepto.js v{{version_number}}
 * - original by Thomas Fuchs (http://github.com/madrobby/zepto), forked by Miller Medeiros (http://github.com/millermedeiros/zepto).
 * Released under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * Build: {{build_number}} - Date: {{build_date}}
 */
 
(function(window, document){


	//------------------------------ Core ---------------------------------//
	
	/**
	 * zepto.js
	 * @constructor
	 * @namespace
	 * @param {string|zepto|HTMLElement} [selector]
	 * @param {HTMLElement|Document|zepto} [context]
	 */
	var zepto = function(selector, context){
		if(this instanceof zepto){ //enforce `new` on constructor (scope-safe).
			var	matched;
			
			//inspired by jQuery.init method (highly simplified)
			
			if(selector && selector.nodeType){ //DOMElement
				context = selector;
				matched = [selector];
				selector = null; //important!
			}else if(selector instanceof zepto){ //zepto object
				selector = selector.selector;
				context = selector.context;
			}
			
			this.selector = selector;
			this.context = context || document;
			
			if(selector && context instanceof zepto){
				matched = [];
				context.each(function(el){
					matched = matched.concat( zepto.makeArray(el.querySelectorAll(selector)) );
				});
				matched = zepto.unique(matched);
			}else if(selector){ //avoid querySelector if `selector` is a DOMElement
				matched = zepto.makeArray( this.context.querySelectorAll(selector) );
			}
			
			Array.prototype.push.apply(this, matched); //copy reference of matched elements to $[n] and save length (convert `zepto` into a pseudo-array object)
			
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
	this.zepto = this.$ = zepto; //export '$' and 'zepto' to global scope
	
	
	/**
	 * @namespace reference to zepto.prototype for easy plugin developement
	 */
	zepto.fn = zepto.prototype = {
		
		/**
		 * Execute a function for each matched element.
		 * @param {Function} fn
		 * @return {zepto}
		 */
		each : function(fn){
			this.get().forEach(function(el){
				fn.call(this, el); //bind `this` to zepto object
			}, this);
			return this;
		},
		
		
		//------------------------------ Traversing ---------------------------------//
		
		/**
		 * Find descendant node based on selector.
		 * @param {string} selector
		 * @return {zepto}
		 */
		find : function(selector){
			return new zepto(selector, this);
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
			return new zepto(this.get(index));
		},
		
		
		//------------------------------ Manipulation ---------------------------------//
		
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
		},
		
		
		//------------------------------ ClassList ---------------------------------//
		
		// As of 2010/09/22 native HTML5 Element.classList is only supported by Firefox 3.6+ 
		
		//TODO: convert classList into a plugin and store in another file and clean up code.
		
		/**
		 * Check if any matched element has given class.
		 * @param {string} className
		 * @return {boolean}
		 */
		hasClass : function(className){
			var ret = false,
				regexHasClass = new RegExp('(?:^| )'+ className +'(?: |$)'); //no need "global" flag since it should only match once.
			this.each(function(el){
				if(el.className.match(regexHasClass)){
					ret = true;
				}
			});
			return ret;
		},
		
		/**
		 * Add class(es) from each matched element.
		 * @param {string} className	One or more class names separated by spaces.
		 * @return {zepto}
		 */
		addClass : function(className){
			this.removeClass(className); //remove all classes before to avoid adding same className multiple times
			return this.each(function(el){
				el.className += ((el.className !== '')? ' ' : '') + zepto.unique(className.trim().split(/ +/g)).join(' ');
			});
		},
		
		/**
		 * Remove class(es) from each matched element.
		 * @param {string} [className]	One or more class names separated by spaces, removes all classes if `null`.
		 * @return {zepto}
		 */
		removeClass : function(className){
			className = className || '.+';
			var regexRemoveClass = new RegExp('(?:^| )'+ className.trim().replace(/ +/g, '|') +'(?: |$)', 'g'); //match all words contained on `className` string
			return this.each(function(el){
				el.className = el.className.replace(regexRemoveClass, ' ').replace(/ +/g, ' ').trim(); //remove multiple spaces and trailing spaces
			});
		},
		
		/**
		 * Add or remove one or more classes from each element in the set of matched elements.
		 * @param {string} className	One or more class names (separate by space) to be toggled.
		 * @param {boolean} isAdd	Switch value, if `true` add class is `false` removes it.
		 */
		toggleClass : function(className, isAdd){
			if(zepto.isDef(isAdd)){
				(isAdd)? this.addClass(className) : this.removeClass(className); 
			}else{
				var classes = className.trim().split(' '),
					regexHasClass,
					elements = this.get(); //for scope and performance 
				classes.forEach(function(c){
					regexHasClass = new RegExp('(?:^| )'+ c +'( |$)', 'g'); //match "class" surrounded by spaces/begin/end of string, needs to be gobal to sanitize className (remove duplicates) - (space|end = $1)
					elements.forEach(function(el){
						if(el.className.match(regexHasClass)){ //TODO: use same methods for toggle/add/remove (combine them into a private function)
							el.className = el.className.replace(regexHasClass, ' ').replace(/ +/g, ' ').trim();
						}else{
							el.className += ((el.className !== '')? ' ' : '') + c;
						}
					});
				});
			}
			return this;
		},
		
		
		//------------------------------ Style ---------------------------------//
		
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
		},
		
		
		//------------------------------ Event ---------------------------------//
		
		/**
		 * @param {string} selector
		 * @param {string} eventType
		 * @param {Function} callback
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
		
	};
	
	//------------------------------ Helpers ------------------------------//
	
	/**
	 * Copy properties from one Object into another (mixin).
	 * - will extend zepto by default if `second` is `undefined`
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
	
	/**
	 * Return Array without any duplicate items.
	 * @param {Array} array
	 * @return {Array}
	 */
	zepto.unique = function(array){
		function unique(item, i, arr){
			return arr.indexOf(item) === i;
		}
		return array.filter(unique);
	};
	
	/**
	 * Convert Array-like object into a true Array
	 * @param {Array} obj
	 * @return {Array}
	 */
	zepto.makeArray = function(obj){
		return Array.prototype.slice.call(obj);
	};
	
	/**
	 * Check if parameter is different than `undefined`.
	 * @return {boolean} `true` if parameter isn't `undefined`.
	 */
	zepto.isDef = function(param){
		return (typeof param !== 'undefined');
	};
	
	//------------------------------ Ajax ---------------------------------//
	
	/**
	 * XML Http Request
	 * @param {string} method	Request Method
	 * @param {string} url	Request URL
	 * @param {Function} [success]	Success Callback
	 * @param {Function} [error]	Error Callback
	 * @return {zepto}
	 */
	zepto.ajax = function(method, url, success, error){
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
	};
	
	/**
	 * Ajax GET
	 * @param {string} url	Request URL
	 * @param {Function} [success]	Success Callback
	 * @param {Function} [error]	Error Callback
	 * @return {zepto}
	 */
	zepto.get = function(url, success, error){
		return zepto.ajax('GET', url, success, error);
	};
	
	/**
	 * Ajax POST
	 * @param {string} url	Request URL
	 * @param {Function} [success]	Success Callback
	 * @param {Function} [error]	Error Callback
	 * @return {zepto}
	 */
	zepto.post = function(url, success, error){
		return zepto.ajax('POST', url, success, error);
	};
	
	/**
	 * Ajax GET with pre-built JSON.parse 
	 * @param {string} url	Request URL
	 * @param {Function} [success]	Success Callback
	 * @param {Function} [error]	Error Callback
	 * @return {zepto}
	 */
	zepto.getJSON = function(url, success, error){
		return zepto.get(url, function(data){
			success(JSON.parse(data));
		}, error);
	};
	
}(window, document));