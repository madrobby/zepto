var $ = function(selector){
  return { dom: Array.prototype.slice.apply(document.querySelectorAll(selector)),
    css: $.css, html: $.html, ajax: $.ajax };
}

$.html = function(html){
  this.dom.forEach(function(el){ el.innerHTML = html }); return this;
}

$.css = function(style){
  this.dom.forEach(function(el){ el.style.cssText += ';'+style }); return this;
}

$.ajax = function(settings){
	if(!settings.url || !settings.success) return;
	var async = settings.async || true,
		data = settings.data || '',
		type = settings.type || 'GET',
		success = settings.success,
		url = settings.url,
		request;
	
	if(typeof data === 'object'){
		var dataArray = [],
			key;
		for(key in data){
			dataArray.push(key + '=' + data[key]); 
		}
		data = '?' + dataArray.join('&');
	}
	
	try{
		request = new XMLHttpRequest();
	}catch(e){}
	
	url = url + data;
	request.onreadystatechange = stateChange;
	request.open(type.toUpperCase(),url,async);
	request.send(null);
	function stateChange(){
		if(request.readyState === 4){
			if(request.status === 200){
				success(request.responseText);
			}else{
				return false;
			}
		}
	}
}