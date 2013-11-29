express = require 'express'
app     = express()
path    = require 'path'

module.exports = app

project_root = path.resolve(__dirname, '..')
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
  res.set 'Cache-Control', 'no-cache'
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

# send JSONP response despite callback not being set
app.get '/test/jsonpBlah', (req, res) ->
  res.set 'Content-Type', 'text/javascript'
  res.send 'blah()'

app.get '/test/json', (req, res) ->
  res.set 'Cache-Control', 'no-cache'
  if /json/.test req.headers['accept']
    if req.query.invalid
      res.set 'Content-Type', 'application/json'
      res.send 'invalidJSON'
    else
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
