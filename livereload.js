/* simple LiveReload client component */
(function($){

var apiVersion = '1.6',
    port = 35729,
    uri = 'ws://' + location.hostname + ':' + port + '/websocket',
    reconnectTimeout = 2000,
    socket, intentionalClose

function debug(msg, type) {
  // console.log(msg)
}

function close() {
  intentionalClose = true
  socket.close()
}

function special(msg) {
  if (/ver:([\d.]+)/.test(msg)) {
    var ver = RegExp.$1
    if (ver == apiVersion) {
      socket.send(location.href)
    } else {
      debug('unsupported protocol: ' + ver, 'error')
      close()
    }
  }
  else debug('unknown message: ' + msg, 'error')
}

function addTimestamp(href) {
  var timestamp = new Date().getTime()

  if (href.indexOf('livereload=') < 0)
    return href + '?livereload=' + timestamp
  else
    return href.replace(/\b(livereload)=\d+/, '$1=' + timestamp)
}

function onStylesheetLoaded(link, fn) {
  setTimeout(fn, 200)
}

// requires Zepto
function refreshStylesheet(path) {
  $('link[rel=stylesheet]').each(function() {
    var link = $(this), href = link.attr('href')

    if (href.indexOf(path) > -1) {
      var newLink = $('<link rel=stylesheet />')
      newLink.attr('href', addTimestamp(href)).insertAfter(link)
      onStylesheetLoaded(newLink, function(){ link.remove() })
      return false
    }
  })
}

function reloadPage() {
  window.location = location.href.split('#', 2)[0]
}

function refresh(path) {
  path = path.split('//', 2)[1]
  if ('' === path) {
    reloadPage()
  } else if (/\.css$/.test(path)) {
    refreshStylesheet(path)
  } else if (/\.js/.test(path)) {
    reloadPage()
  }
}

function message(e) {
  if ('!!' == e.data.slice(0,2)) special(e.data)
  else {
    var data = JSON.parse(e.data),
        action = data[0], options = data[1]

    if ('refresh' == action) refresh(options.path, options)
    else debug('unknown action: ' + action, 'error')
  }
}

function connect(onmessage, reconnect) {
  socket = new WebSocket(uri)

  socket.onopen = function(e){
    debug('open')
  }
  socket.onmessage = onmessage
  socket.onclose = function(e){
    debug('close')
    if (!intentionalClose) reconnect()
    intentionalClose = false
  }
  socket.onerror = function(e){ debug('error') }
}

connect(message, function(){
  var self = arguments.callee
  setTimeout(function(){ connect(message, self) }, reconnectTimeout)
})

})(Zepto)
