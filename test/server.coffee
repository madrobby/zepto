express = require 'express'
app     = express()

module.exports = app

project_root = __dirname.replace(/\/[^\/]+$/, '/')
app.use express.static(project_root)
app.use express.static(project_root + 'node_modules/mocha')
app.use express.static(project_root + 'node_modules/chai')

app.use express.bodyParser()

mime = (req) ->
  type = req.headers['content-type'] or ''
  type.split(';')[0]

dump = (obj) ->
  obj = '' unless obj
  obj = JSON.stringify(obj) if obj and typeof obj isnt "string"
  obj

app.all '/test/echo', (req, res) ->
  res.send """
           #{req.method} ?#{dump(req.query)}
           content-type: #{mime(req)}
           accept: #{req.headers['accept']}
           #{dump(req.body)}
           """

app.get '/test/jsonp', (req, res) ->
  res.jsonp
    query: req.query
    hello: 'world'

app.get '/test/json', (req, res) ->
  if /json/.test req.headers['accept']
    res.json
      query: req.query
      hello: 'world'
  else
    res.send 400, 'FAIL'

app.all '/test/slow', (req, res) ->
  setTimeout ->
    res.send 'DONE'
  , 200

app.all '/test/error', (req, res) ->
  res.send 500, 'BOOM'

if process.argv[1] is __filename
  port = process.argv[2]
  unless port
    port = 3000
    console.log "Listening on port #{port}"
  app.listen port
