var connect = require('connect')
  , parse = connect.utils.parseUrl
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
        else next()
      })

http.createServer(app).listen(port)
