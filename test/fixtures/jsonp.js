for (key in window) {
  // we can't read callback from URL, hence this hack
  if (/^jsonp(\d+)$/.test(key)) {
    window[key]({ hello: 'world' })
  }
}
delete window.key
