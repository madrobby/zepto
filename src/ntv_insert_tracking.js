;(function ($) { 
  function getURI(text){
    var url = null
    if(/src=("|\')([\w\/\:\.\?\&=\d\;\-\_\%\#\+\$\,\@\[\]\{\}\<\>\|]+)("|\')/gi.test(text)) 
      url= /src=("|\')([\w\/\:\.\?\&=\d\;\-\_\%\#\+\$\,\@\[\]\{\}\<\>\|]+)("|\')/gi.exec(text)[2]
    return url
  }
  function removeScriptNodeOnLoad(e) { document.head.removeChild(e.target) }
  function createScriptNodeFromNode(text) {
    if(getURI(text)){
      var jsnode = document.createElement("script")
        jsnode.src = getURI(text)
        jsnode.type =  "text/javascript"
        jsnode.onload = removeScriptNodeOnLoad
        jsnode.onerror = removeScriptNodeOnLoad
        document.head.appendChild( jsnode )
    }else{
      var div = document.createElement("div")
        div.innerHTML = text
        window.eval(div.childNodes[0].textContent)
    }
  } 
  var document = window.document;
  $.fn.insertTracking = function (e) {
        switch(/(^<img)|(^<script)/.exec(e.data)[0]){
          case "<img":
              new Image().src =  getURI(e.data) || "" 
          break;
          case "<script": 
              createScriptNodeFromNode(e.data)
          break;
          default:
          break;
        }
    }
})(nQuery)