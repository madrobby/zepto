var connect = require('connect')
  , parse = connect.utils.parseUrl
  , pause = connect.utils.pause
  , mime  = connect.utils.mime
  , http = require('http')
  , fs   = require('fs')
  , port = process.argv[2] || 3000
  , app = connect()
      .use(connect.static(__dirname + '/../'))  // serve static files from root dir
      .use(connect.query())
      .use(connect.urlencoded())
      .use(connect.json())
      .use(function(req, res, next) {
        var url = parse(req)
        // provide an echo endpoint for POSTs and such
        if (url.pathname == "/test/echo") {
          var body = req.method
          // echo query params
          if (req.query) body += ' ?' + JSON.stringify(req.query)
          // echo request headers
          body += "\ncontent-type: " + mime(req)
          body += "\naccept: " + req.headers['accept']
          // echo request body
          if (typeof req.body == "string") body += "\n" + req.body
          else if (req.body) body += "\n" + JSON.stringify(req.body)
          res.end(body)
        }
        else if (url.pathname == "/test/jsonp") {
          var name = req.query.callback
          if (name) {
            delete req.query.callback
            var payload = { query: req.query, hello: "world" }
            res.setHeader('content-type', 'application/javascript')
            res.end(name + '(' + JSON.stringify(payload) + ')')
          } else {
            res.statusCode = 400
            res.end("FAIL")
          }
        }
        else if (url.pathname == "/test/json") {
          var accepts = String(req.headers['accept'])
          if (accepts.match(/json/)) {
            var payload = { query: req.query, hello: "world" }
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(payload))
          } else {
            res.statusCode = 400
            res.end("invalid accept type: " + accepts)
          }
        }
        else if (url.pathname == "/test/slow") {
          var stopped = pause(req)
          setTimeout(function(){
            stopped.resume()
            res.end("DONE")
          }, 200)
        }
        else if (url.pathname == "/test/error") {
          res.statusCode = 500
          res.end("BOOM")
        }
        else next()
      })

http.createServer(app).listen(port)
