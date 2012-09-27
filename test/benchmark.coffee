if location.search
  for pair in location.search.slice(1).split('&')
    [ key, value ] = pair.split('=', 2)
    Benchmark.options[key] = Number value if key of Benchmark.options

round = (n, precision = 0) ->
  p = Math.pow 10, precision
  Math.round(n * p) / p

logToServer = (name, comp, rme) ->
  message = "#{comp} (+/- #{rme}%)"
  body = "name=#{encodeURIComponent(name)}&message=#{encodeURIComponent(message)}&trace="

  xhr = new XMLHttpRequest()
  xhr.open('POST', '/test/log', false)
  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
  xhr.send(body)

Benchmark.Suite.options.onStart = ->
  $('#results caption').text "running #{this.name}..."
  $('#results tr').remove()

Benchmark.Suite.options.onComplete = ->
  suite = this
  base = passed = null

  this.forEach (bm) ->
    base = bm.hz if bm.name is 'jQuery'

  this.forEach (bm) ->
    passed = bm.hz > base if bm.name is 'Zepto'

    if bm.error
      console.log "#{bm.name} error"
    else
      hz   = Benchmark.formatNumber round(bm.hz)
      rme  = round(bm.stats.rme, 2)
      diff = (bm.hz - base) / base
      comp = if diff then round(diff * 100) + '%' else 'base'

      logToServer suite.name, comp, rme if bm.name is 'Zepto'

      $("""
        <tr>
          <th>#{bm.name}</th>
          <td>#{hz}</td>
          <td>#{comp}</td>
          <td>&plusmn;#{rme}%</td>
        </tr>
      """).appendTo('#results')

  $('#fixtures').empty()
  $('#results')
    .addClass('finished')
    .toggleClass('passed', passed)
    .find('caption').text(this.name)

window.run = (name, fn, nativeFn) ->
  suite = new Benchmark.Suite(name)
  suite.add 'ZeptoBase',
    setup: 'var $ = ZeptoBase'
    fn: fn
  suite.add 'Zepto',
    setup: 'var $ = Zepto'
    fn: fn
  suite.add 'jQuery',
    setup: 'var $ = jQuery'
    fn: fn
  suite.add 'native', nativeFn

  suite.run()
    # async: true
    # queued: true

window.setup = ->
  # stub
