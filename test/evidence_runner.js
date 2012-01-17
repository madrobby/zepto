(function(){
  var ConsoleTestRunner = Evidence.AutoRunner.RUNNERS.console,
      ConsoleTestResult = Evidence.UI.Console.TestResult,
      Logger = Evidence.UI.Console.Logger,
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
      }
    }
  })

  /* JHW = Jasmine Headless WebKit */

  var JHWLogger = inherit(Logger, function(_super) {
    Evidence.AutoRunner.LOGGERS.jhw = this
    return {
      log: function(level, msg, params) {
        level = level || Logger.NOTSET;
        if (level >= this.level) {
          if (params) msg = printf(msg, params)
          if (level >= Logger.WARN) console.log(msg)
          else JHW.log(msg)
        }
      }
    }
  })

  var JHWTestRunner = inherit(ConsoleTestRunner, function(_super) {
    Evidence.AutoRunner.RUNNERS.jhw = this
    return {
      _makeResult: function() { return new JHWTestResult(this.logger) }
    }
  })

  var JHWTestResult = inherit(Evidence.TestResult, function(_super) {
    return {
      initialize: function(logger) {
        Evidence.TestResult.call(this)
        this.logger = logger
        this.failuresBuffer = []
      },
      addSkip: function(testcase, msg) {
        _super.addSkip.call(this, testcase, msg)
        this.failuresBuffer.push(function(){
          JHW.printResult('Skipping testcase ' + testcase + ': ' + msg.message)
        })
      },
      addFailure: function(testcase, msg) {
        _super.addFailure.call(this, testcase, msg)
        JHW.specFailed(msg)
        this.failuresBuffer.push(function(){
          JHW.printResult(printf(testcase + ': ' + msg.message + ' ' + msg.template, msg.args))
        })
      },
      addError: function(testcase, error) {
        _super.addError.call(this, testcase, error)
        JHW.specFailed(error)
        this.failuresBuffer.push(function(){
          JHW.printResult(testcase + ': ' + error)
        })
      },
      startTest: function(testcase) {
        _super.startTest.call(this, testcase)
        this.logger.debug('Started testcase ' + testcase + '.')
      },
      stopTest: function(testcase) {
        this.logger.debug('Completed testcase ' + testcase + '.')
        JHW.specPassed()
      },
      pauseTest: function(testcase) {
        this.logger.debug('Paused testcase ' + testcase + '.')
      },
      restartTest: function(testcase) {
        this.logger.debug('Restarted testcase ' + testcase + '.')
      },
      startSuite: function(suite) {
        this.logger.info('Started suite ' + suite + '.')
      },
      stopSuite: function(suite) {
        this.logger.debug('Completed suite ' + suite + '.')
        if (this.failuresBuffer.length) JHW.printResult('') // HACK: force newline
        while (this.failuresBuffer.length)
          this.failuresBuffer.shift().call(this)
      },
      start: function(t0) {
        _super.start.call(this, t0)
        this.logger.debug('Started tests.')
      },
      stop: function(t1) {
        _super.stop.call(this, t1)
        JHW.finishSuite((t1-this.t0)/1000, this.testCount, this.failureCount + this.errorCount)
      }
    }
  })

  // HACK: force our test runner as default
  ;(function(){
    var _super = AutoRunner.prototype.retrieveOptions
    AutoRunner.prototype.retrieveOptions = function() {
      var options = _super.call(this)
      if (!options.runner) options.runner = window.JHW ? 'jhw' : 'zepto'
      if (!options.logger && window.JHW) options.logger = 'jhw'
      if (!options.timeout && window.JHW) options.timeout = 4
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
