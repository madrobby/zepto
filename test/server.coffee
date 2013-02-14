fs      = require 'fs'
coffee  = require 'coffee-script'
express = require 'express'
app     = express()
port    = process.argv[2] || 3000

app.use express.static(__dirname + '/../')
app.use express.static('node_modules/mocha')
app.use express.static('node_modules/chai')

app.use express.bodyParser()

mime = (req) ->
  type = req.headers['content-type'] or ''
  type.split(';')[0]

dump = (obj) ->
  obj = '' unless obj
  obj = JSON.stringify(obj) if obj and typeof obj isnt "string"
  obj

app.get '/', (req, res) ->
  res.sendfile "test/mocha.html"

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

# GET /compile.js?group=core
# compiles all "test/core/*.coffee" files and serves as JS
app.get '/compile.js', (req, res) ->
  test_dir = "#{__dirname}/#{req.query.group}"

  fs.readdir test_dir, (err, files) ->
    if err
      res.send 500, err.message
    else
      compiled = for file in files
        coffee.compile fs.readFileSync("#{test_dir}/#{file}", "utf-8")

      res.set 'content-type', 'application/javascript'
      res.send compiled.join("\n")

app.listen port
console.log "Listening on port #{port}" if port is 3000
