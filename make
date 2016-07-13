#!/usr/bin/env coffee
require 'shelljs/make'
fs = require 'fs'

zepto_js  = 'dist/zepto.js'
zepto_min = 'dist/zepto.min.js'
zepto_gz  = 'dist/zepto.min.gz'

port = 3999
root = __dirname + '/'

target.all = ->
  target[zepto_js]()
  target.test()

## TASKS ##

target.test = ->
  test_app = require './test/server'
  server = test_app.listen port
  exec "phantomjs --disk-cache=true test/runner.js 'http://localhost:#{port}/'", (code) ->
    server.close -> exit(code)

target[zepto_js] = ->
  target.build() unless test('-e', zepto_js)

target[zepto_min] = ->
  target.minify() if stale(zepto_min, zepto_js)

target[zepto_gz] = ->
  target.compress() if stale(zepto_gz, zepto_min)

target.dist = ->
  target.build()
  target.minify()
  target.compress()

target.build = ->
  cd __dirname
  mkdir '-p', 'dist'
  modules = (env['MODULES'] || 'zepto event ajax form ie').split(' ')
  module_files = ( "src/#{module}.js" for module in modules )
  intro = "/* Zepto #{describe_version()} - #{modules.join(' ')} - zeptojs.com/license */\n"
  dist = cat(module_files).replace(/^\/[\/*].*$/mg, '').replace(/\n{3,}/g, "\n\n")
  dist = cat('src/amd_layout.js').replace(/YIELD/, -> dist.trim()) unless env['NOAMD']
  (intro + dist).to(zepto_js)
  report_size(zepto_js)

target.minify = ->
  target.build() unless test('-e', zepto_js)
  zepto_code = cat(zepto_js)
  intro = zepto_code.slice(0, zepto_code.indexOf("\n") + 1)
  (intro + minify(zepto_code)).to(zepto_min)
  report_size(zepto_min)

target.compress = ->
  gzip = require('zlib').createGzip()
  inp = fs.createReadStream(zepto_min)
  out = fs.createWriteStream(zepto_gz)
  inp.pipe(gzip).pipe(out)
  out.on 'close', ->
    report_size(zepto_gz)
    factor = fsize(zepto_js) / fsize(zepto_gz)
    echo "compression factor: #{format_number(factor)}"

target.publish = ->
  tag = 'v' + package_version()
  if git_version() == tag
    rm '-f', zepto_js
    env['MODULES'] = env['NOAMD'] = ''
    target.dist()
    res = exec 'npm publish'
    exit res.code
  else
    console.error 'error: latest commit should be tagged with ' + tag
    exit 1

## HELPERS ##

stale = (file, source) ->
  target[source]()
  !test('-e', file) || mtime(file) < mtime(source)

mtime = (file) ->
  fs.statSync(file).mtime.getTime()

fsize = (file) ->
  fs.statSync(file).size

format_number = (size, precision = 1) ->
  factor = Math.pow(10, precision)
  decimal = Math.round(size * factor) % factor
  parseInt(size) + "." + decimal

report_size = (file) ->
  echo "#{file}: #{format_number(fsize(file) / 1024)} KiB"

package_version = ->
  JSON.parse(cat('package.json')).version

git_version = ->
  desc = exec "git --git-dir='#{root + '.git'}' describe --tags HEAD", silent: true
  desc.output.replace(/\s+$/, '') if desc.code is 0

describe_version = ->
  git_version() || package_version()

minify = (source_code) ->
  uglify = require('uglify-js')
  compressor = uglify.Compressor()
  ast = uglify.parse(source_code)
  ast.figure_out_scope()
  ast.compute_char_frequency()
  ast.mangle_names()
  ast = ast.transform(compressor)
  return ast.print_to_string()
