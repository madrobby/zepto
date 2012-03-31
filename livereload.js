/* simple LiveReload client component */
(function($){

var apiVersion = '1.6',
    port = 35729,
    uri = 'ws://' + location.hostname + ':' + port + '/websocket',
    active, socket

function connect() {
  socket = new WebSocket(uri)
}

function debug(type, e) {
  console.log('%s: %o', type, e.data)
  console.log('readyState: %d', socket.readyState)
}

function special(msg) {
  if (/ver:([\d.]+)/.test(msg)) {
    var ver = RegExp.$1
    if (ver == apiVersion) {
      socket.send(location.href)
    } else {
      console.error('unsupported protocol: ' + ver)
      socket.close()
    }
  }
  else console.error('unknown message: ' + msg)
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
  window.location = location.href
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
    else console.error('unknown action: ' + action)
  }
}

connect()

socket.onopen = function(e){
  active = true
}
socket.onmessage = message
socket.onclose = function(e){
  if (!active) setTimeout(connect, 1000)
  active = false
}
socket.onerror = function(e){ debug('error', e) }

})(Zepto)
