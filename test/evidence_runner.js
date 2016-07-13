(function(){
  var ConsoleTestRunner = Evidence.AutoRunner.RUNNERS.console,
      ConsoleTestResult = Evidence.UI.Console.TestResult,
      AutoRunner = Evidence.AutoRunner,
      printf = Evidence.UI.printf

  function inherit(superclass, extra) {
    var klass = function(){
      this.initialize.apply(this, arguments)
    }
    var tmp = function(){}
    tmp.prototype = superclass.prototype
    klass.prototype = new tmp()
    klass.prototype.constructor = klass
    klass.prototype.initialize = function(){
      superclass.apply(this, arguments)
    }

    if (extra) {
      var methods = extra.call(klass, superclass.prototype)
      for (var method in methods) klass.prototype[method] = methods[method]
    }
    return klass
  }

  var TestRunner = inherit(ConsoleTestRunner, function(_super) {
    AutoRunner.RUNNERS.zepto = this
    return {
      _makeResult: function() { return new TestResult(this.logger) }
    }
  })

  var TestResult = inherit(ConsoleTestResult, function(_super) {
    return {
      start: function(t0) {
        Evidence.TestResult.prototype.start.call(this, t0)
        this.logger.debug('Started tests.')
      },
      stop: function(t1) {
        _super.stop.call(this, t1)
        displayResults(this, (t1-this.t0)/1000)
        checkLeakedGlobals()
      },
      pauseTest: function(testcase) {
        this.logger.debug('Paused testcase ' + testcase + '.')
      },
      restartTest: function(testcase) {
        this.logger.debug('Restarted testcase ' + testcase + '.')
      },
      startSuite: function(suite) {
        this.logger.debug('Started suite ' + suite + '.')
      },
      addFailure: function(testcase, reason) {
        this.logToServer(testcase, reason)
        _super.addFailure.call(this, testcase, reason)
      },
      addError: function(testcase, error) {
        this.logToServer(testcase, error)
        _super.addError.call(this, testcase, error)
      },
      logToServer: function(testcase, error) {
        if (location.protocol == 'file:') return
        var name = testcase.parent.name + '#' + testcase.name,
            message = error.template ?
              Evidence.UI.printf(error.template, error.args) + (error.message ? ' ' + error.message : '') :
              error.message,
            body = 'name=' + encodeURIComponent(name) + '&' +
                   'message=' + encodeURIComponent(message) + '&' +
                   'trace=' + encodeURIComponent(error.stack || '')

        var xhr = new XMLHttpRequest()
        xhr.open('POST', '/test/log', true)
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
        xhr.send(body)
      }
    }
  })

  Evidence.TestCase.prototype.debug = function(message) {
    this._result.logToServer(this, { message: message })
  }

  // HACK: force our test runner as default
  ;(function(){
    var _super = AutoRunner.prototype.retrieveOptions
    AutoRunner.prototype.retrieveOptions = function() {
      var options = _super.call(this)
      if (!options.runner) options.runner = 'zepto'
      return options
    }
  })()

  function $(id) { return document.getElementById(id) }

  function displayResults(results, seconds) {
    var container = $('results')
    if (container) {
      if (results.failureCount || results.errorCount) {
        container.className = 'failed'
        container.innerHTML = printf("Finished in %d s. &ndash; <em>%d failures, %d errors</em> (%d assertions)",
                                     [seconds, results.failureCount, results.errorCount, results.assertionCount])
      } else {
        container.className = 'passed'
        container.innerHTML = printf("Finished in %d s. &ndash; <em>%d tests passed</em> (%d assertions)",
                                     [seconds, results.testCount, results.assertionCount])
      }
      container.className += ' finished'
    }
  }

  var globals = [], expected = ['Zepto', '$', 'Evidence', '_zid', 'jsonpDummy']
  for (var key in window) globals.push(key)

  function checkLeakedGlobals() {
    var opera = /^Opera\b/.test(navigator.userAgent)
    for (var key in window)
      if ( globals.indexOf(key) < 0 && expected.indexOf(key) < 0 &&
          (!opera || typeof window[key] != 'object' || window[key].id != key) &&
          window.console && console.warn
          )
        console.warn("unexpected global: " + key)
  }
})()
