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
    Evidence.AutoRunner.RUNNERS.zepto = this
    return {
      _makeResult: function() { return new TestResult(this.logger) }
    }
  })

  var TestResult = inherit(ConsoleTestResult, function(_super) {
    return {
      stop: function(t1) {
        _super.stop.call(this, t1)
        displayResults(this, (t1-this.t0)/1000)
        checkLeakedGlobals()
      }
    }
  })

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
        container.innerHTML = printf("Finished in %d s. &ndash; <em>%d failures, %d errors</em>",
          [seconds, results.failureCount, results.errorCount])
        container.className = 'failed'
      } else {
        container.innerHTML = printf("Finished in %d s. &ndash; <em>%d tests passed</em>", [seconds, results.testCount])
        container.className = 'passed'
      }
    }
  }

  var globals = [], expected = ['Zepto', '$', 'Evidence']
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
