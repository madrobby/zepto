# Test runner for PhantomJS <phantomjs.org>
# Usage:
#   $ phantomjs test/runner.coffee <url-prefix> [<page1>, <page2>, ...]
#
# When no test pages specified, runs all automated tests.

system = require('system')
fs = require('fs')

args = system.args.slice(1)
prefix = args.shift() || "file://#{fs.workingDirectory}/"

if args.length > 0
  # list of test pages to run
  suites = args
else
  # by default, run all test/*.html pages
  modules = 'zepto ajax callbacks data deferred detect event form fx selector stack'.split /\s+/
  suites = modules.map (name)-> "test/#{name}.html"

page = require('webpage').create()

page.onConsoleMessage = (msg) ->
  console.log msg

page.onError = (msg, trace) ->
  console.log 'ERROR: ' + msg

# used for waiting until the tests finish running
waitFor = (testFn, onReady, timeout=4000) ->
  start = new Date()
  interval = setInterval ->
    if testFn()
      clearInterval interval
      onReady()
    else if new Date() - start > timeout
      console.log "timed out."
      phantom.exit(1)
  , 100

addParam = (url, name, val) ->
  hasQuery = url.indexOf('?') > -1
  url + "#{if hasQuery then '&' else '?'}#{name}=#{val}"

loadNextSuite = ->
  if not suites.length
    phantom.exit()
  else
    url = suites.shift()
    profiling = url.indexOf('benchmark.html') > -1
    # PhantomJS chokes on the query string on relative paths
    url = prefix + url if not /:\/\//.test url

    if profiling
      url = addParam url, 'maxTime', 1
      timeout = 60000
    else
      url = addParam url, 'verbosity', 'WARN'
      timeout = 5000

    page.open url, (status) ->
      if status isnt "success"
        console.log "failed opening #{url}"
        phantom.exit(1)

      waitFor ->
        page.evaluate ->
          # the "#results" element needs to have the "finished" class
          res = document.getElementById 'results'
          /finished/.test res.className if res
      , ->
        passed = page.evaluate ->
          res = document.getElementById 'results'
          # print results to the console
          if res.tagName is 'TABLE'
            captionText = res.caption.textContent.trim()
            console.log captionText
            console.log new Array(captionText.length + 1).join('-')
            for row in res.rows
              fields = for cell, i in row.cells
                cellText = cell.textContent.trim()
                width = (if i < 2 then 12 else 7) - cellText.length
                cellText + new Array(width + 1).join(' ')
              console.log fields.join("")
          else
            paths = location.pathname.split('/')
            console.log "#{paths[paths.length - 1]} - " + res.textContent
          # check if suite has passed
          /passed/.test res.className

        if passed
          loadNextSuite()
        else
          phantom.exit(1)
      , timeout

loadNextSuite()
