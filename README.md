# Zepto.js – a minimalist JavaScript library

Zepto is a minimalist JavaScript library for modern browsers with a
largely jQuery-compatible API. If you use jQuery, you already know how to use Zepto.

See [zeptojs.com](http://zeptojs.com) for an extended introduction, downloads
and documentation.

Zepto.js is licensed under the terms of the MIT License.

## Building

[![Build Status](https://secure.travis-ci.org/madrobby/zepto.png?branch=master)](http://travis-ci.org/madrobby/zepto)

The official site offers a download of the default distribution of Zepto. This
is good for starting out. However, at some point you might want to add some
optional modules and remove some of the default ones you don't need, to keep the
size at minimum. That's when you need to check out Zepto's source code and use
the build commands.

You will need ruby, RubyGems, and rake installed on your system.

~~~ sh
# dependencies:
$ ruby -v
$ gem -v
$ rake -V

# required to generate the minified version:
$ gem install uglifier
~~~

Build Zepto by running `rake`:

~~~ sh
$ rake
Original version: 40.423k
Minified: 18.776k
Minified and gzipped: 7.033k, compression factor 5.747
~~~

The resulting files are:

1. `dist/zepto.js`
2. `dist/zepto.min.js`

To include optional modules and remove default ones, use the `concat` task. In
this example, "fx" is removed, but "data" and "selector" are added:

~~~
$ rake concat[-fx:data:selector] dist
~~~

## Zepto modules

Zepto modules are individual files in the "src/" directory. You can also list
the available modules by running `rake modules`.

<table>
<thead><tr>
  <th>module</th> <th>default</th> <th>description</th>
</tr></thead>
<tbody>
  <tr>
    <th><a href="https://github.com/madrobby/zepto/blob/master/src/polyfill.js#files">polyfill</a></th>
    <td>✔</td>
    <td>
      Provides String.prototype.trim and Array.prototype.reduce methods
      if they are missing (required for iOS 3.x)
    </td>
  </tr>
  <tr>
    <th><a href="https://github.com/madrobby/zepto/blob/master/src/zepto.js#files">zepto</a></th>
    <td>✔</td>
    <td>Core module; contains most methods</td>
  </tr>
  <tr>
    <th><a href="https://github.com/madrobby/zepto/blob/master/src/event.js#files">event</a></th>
    <td>✔</td>
    <td>Event handling via <code>on()</code> &amp; <code>off()</code></td>
  </tr>
  <tr>
    <th><a href="https://github.com/madrobby/zepto/blob/master/src/detect.js#files">detect</a></th>
    <td>✔</td>
    <td>Provides <code>$.os</code> and <code>$.browser</code> information</td>
  </tr>
  <tr>
    <th><a href="https://github.com/madrobby/zepto/blob/master/src/fx.js#files">fx</a></th>
    <td>✔</td>
    <td>The <code>animate()</code> method</td>
  </tr>
  <tr>
    <th><a href="https://github.com/madrobby/zepto/blob/master/src/fx_methods.js#files">fx_methods</a></th>
    <td></td>
    <td>
      Animated <code>show</code>, <code>hide</code>, <code>toggle</code>,
      and <code>fade*()</code> methods.
    </td>
  </tr>
  <tr>
    <th><a
href="https://github.com/madrobby/zepto/blob/master/src/ajax.js#files">ajax</a></th>
    <td>✔</td>
    <td>XMLHttpRequest and JSONP functionality</td>
  </tr>
  <tr>
    <th><a
href="https://github.com/madrobby/zepto/blob/master/src/form.js#files">form</a></th>
    <td>✔</td>
    <td>Serialize &amp; submit web forms</td>
  </tr>
  <tr>
    <th><a href="https://github.com/madrobby/zepto/blob/master/src/assets.js#files">assets</a></th>
    <td></td>
    <td>
      Experimental support for cleaning up iOS memory after removing
      image elements from the DOM.
    </td>
  </tr>
  <tr>
    <th><a
href="https://github.com/madrobby/zepto/blob/master/src/data.js#files">data</a></th>
    <td></td>
    <td>
      A full-blown <code>data()</code> method, capable of storing arbitrary
      objects in memory.
    </td>
  </tr>
  <tr>
    <th><a
href="https://github.com/madrobby/zepto/blob/master/src/selector.js#files">selector</a></th>
    <td></td>
    <td>
      Experimental <a href="http://api.jquery.com/category/selectors/jquery-selector-extensions/">jQuery
      CSS extensions</a> support for functionality such as <code>$('div:first')</code> and
      <code>el.is(':visible')</code>.
    </td>
  </tr>
  <tr>
    <th><a href="https://github.com/madrobby/zepto/blob/master/src/touch.js#files">touch</a></th>
    <td></td>
    <td>Fires tap– and swipe–related events on touch devices</td>
  </tr>
  <tr>
    <th><a href="https://github.com/madrobby/zepto/blob/master/src/gesture.js#files">gesture</a></th>
    <td></td>
    <td>Fires pinch gesture events on touch devices</td>
  </tr>
  <tr>
    <th><a href="https://github.com/madrobby/zepto/blob/master/src/stack.js#files">stack</a></th>
    <td></td>
    <td>Provides <code>andSelf</code> &amp; <code>end()</code> chaining methods</td>
  </tr>
</tbody>
</table>

## Contributing

Get in touch:

* IRC channel: [#zepto on freenode.net](irc://irc.freenode.net/zepto)
* @[zeptojs](http://twitter.com/zeptojs)

### Report a bug

1. Check if the bug is already fixed in the [master branch][master] since the
   last release.
2. Check [existing issues][issues]. Open a new one, including exact browser &
   platform information. For better formatting of your report, see
   [GitHub-flavored Markdown][mkd].

### Running tests

Zepto test suite is in "test/\*.html" files. Open the individual files in a web
browser to run the tests. Files named with "\_functional" are not automated
tests, but require interaction. Automated tests are written using
[Evidence.js][].

Detailed test information such as specific failures is logged to the JavaScript
console of your browser.

It's possible to run automated tests from the command-line in headless Webkit
with [PhantomJS][]:

~~~ sh
# install on Mac OS
$ brew install phantomjs

# run all tests
$ rake test

# run individual files
$ script/test test/selector.html
~~~

### Code style guidelines

* `function name() { }` for named functions
* `function(){ }` for anonymous functions
* No curly braces for single-line control flow statements such as `if` & friends
* Don't write [semicolons that are optional][optional]
* Put a single semicolon _before_ statements that start with `(` or `[`
  (see above article as for why it's needed)
* Use long, descriptive variable and method names
* Use blank lines to separate "paragraphs" of code for readability
* Use comments to describe non-obvious code behavior


  [master]: https://github.com/madrobby/zepto/commits/master
  [issues]: https://github.com/madrobby/zepto/issues
  [mkd]: http://github.github.com/github-flavored-markdown/
  [evidence.js]: https://github.com/tobie/Evidence
  [optional]: http://mislav.uniqpath.com/2010/05/semicolons/
  [phantomjs]: http://code.google.com/p/phantomjs/wiki/Installation
