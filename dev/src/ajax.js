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