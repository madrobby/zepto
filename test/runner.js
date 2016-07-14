(function() {
  var fs = require('fs')
  var system = require('system')
  var args = system.args.slice(1)

  var prefix = args.shift() || ("file://" + fs.workingDirectory + "/")

  var suites
  if (args.length > 0) {
    suites = args
  } else {
    var modules = 'zepto ajax callbacks data deferred ajax_deferred detect touch event form fx selector stack'.split(/\s+/)
    suites = modules.map(function(name) {
      return "test/" + name + ".html"
    })
  }

  var page = require('webpage').create()

  page.onConsoleMessage = function(msg) {
    console.log(msg)
  }

  page.onError = function(msg, trace) {
    console.log('ERROR: ' + msg)
  }

  function waitFor(testFn, onReady, timeout) {
    if (timeout == null) {
      timeout = 30000
    }
    var start = new Date()
    var interval = setInterval(function() {
      if (testFn()) {
        clearInterval(interval)
        onReady()
      } else if (new Date() - start > timeout) {
        console.log("timed out.")
        phantom.exit(1)
      }
    }, 100)
  }

  function loadNextSuite() {
    if (!suites.length) {
      phantom.exit()
    } else {
      var url = suites.shift() + "?verbosity=WARN"
      if (!/:\/\//.test(url)) {
        url = prefix + url
      }
      page.open(url, function(status) {
        if (status !== "success") {
          console.log("failed opening " + url)
          return phantom.exit(1)
        }
        waitFor(function() {
          return page.evaluate(function() {
            var res = document.getElementById('results')
            if (res) {
              return /finished/.test(res.className)
            }
          })
        }, function() {
          var passed = page.evaluate(function() {
            var res = document.getElementById('results')
            var paths = location.pathname.split('/')
            console.log((paths[paths.length - 1] + " - ") + res.textContent)
            return /passed/.test(res.className)
          })
          if (passed) {
            loadNextSuite()
          } else {
            phantom.exit(1)
          }
        })
      })
    }
  }

  loadNextSuite()

}).call(this)
