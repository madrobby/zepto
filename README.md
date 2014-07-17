# Zepto.js – a minimalist JavaScript library

Zepto is a minimalist JavaScript library for modern browsers with a
largely jQuery-compatible API. If you use jQuery, you already know how to use Zepto.

See [zeptojs.com][] for an extended introduction, downloads
and documentation.

Zepto.js is licensed under the terms of the MIT License.

Want to give us money or a tip? Don't.
Instead please donate to [charity: water](http://charitywater.org/).

## Building

[![Build Status](https://secure.travis-ci.org/madrobby/zepto.png?branch=master)](http://travis-ci.org/madrobby/zepto)

The official site offers a download of the default distribution of Zepto. This
is good for starting out. However, at some point you might want to add some
optional modules and remove some of the default ones you don't need, to keep the
size at a minimum. That's when you need to check out Zepto's source code and use
the build commands. Alternatively you can use the web based [Zepto Builder](http://github.e-sites.nl/zeptobuilder/)

You will need Node.js installed on your system.

~~~ sh
$ npm install
$ npm run-script dist

# do a custom build
$ MODULES="zepto event data" npm run-script dist

# on Windows
c:\zepto> SET MODULES=zepto event data
c:\zepto> npm run-script dist
~~~

The resulting files are:

1. `dist/zepto.js`
2. `dist/zepto.min.js`

If you install CoffeeScript globally, you can run `make` directly:

~~~ sh
# one-time operation
$ npm install coffee-script --global

$ coffee make dist
$ MODULES="zepto event data ..." ./make dist

# on Windows
c:\zepto> SET MODULES=zepto event data
c:\zepto> coffee make dist
~~~

## Zepto modules

Zepto modules are individual files in the "src/" directory.

<table>
<thead><tr>
  <th>module</th> <th>default</th> <th>description</th>
</tr></thead>
<tbody>
  <tr>
    <th><a href="src/zepto.js#files">zepto</a></th>
    <td>✔</td>
    <td>Core module; contains most methods</td>
  </tr>
  <tr>
    <th><a href="src/event.js#files">event</a></th>
    <td>✔</td>
    <td>Event handling via <code>on()</code> &amp; <code>off()</code></td>
  </tr>
  <tr>
    <th><a href="src/ajax.js#files">ajax</a></th>
    <td>✔</td>
    <td>XMLHttpRequest and JSONP functionality</td>
  </tr>
  <tr>
    <th><a href="src/form.js#files">form</a></th>
    <td>✔</td>
    <td>Serialize &amp; submit web forms</td>
  </tr>
  <tr>
    <th><a href="src/ie.js#files">ie</a></th>
    <td>✔</td>
    <td>Support for Internet Explorer 10+ on the desktop and Windows Phone 8</td>
  </tr>
  <tr>
    <th><a href="src/detect.js#files">detect</a></th>
    <td></td>
    <td>Provides <code>$.os</code> and <code>$.browser</code> information</td>
  </tr>
  <tr>
    <th><a href="src/fx.js#files">fx</a></th>
    <td></td>
    <td>The <code>animate()</code> method</td>
  </tr>
  <tr>
    <th><a href="src/fx_methods.js#files">fx_methods</a></th>
    <td></td>
    <td>
      Animated <code>show</code>, <code>hide</code>, <code>toggle</code>,
      and <code>fade*()</code> methods.
    </td>
  </tr>
  <tr>
    <th><a href="src/assets.js#files">assets</a></th>
    <td></td>
    <td>
      Experimental support for cleaning up iOS memory after removing
      image elements from the DOM.
    </td>
  </tr>
  <tr>
    <th><a href="src/data.js#files">data</a></th>
    <td></td>
    <td>
      A full-blown <code>data()</code> method, capable of storing arbitrary
      objects in memory.
    </td>
  </tr>
  <tr>
    <th><a href="src/deferred.js#files">deferred</a></th>
    <td></td>
    <td>
      Provides <code>$.Deferred</code> promises API.
      Depends on the "callbacks" module.
    </td>
  </tr>
  <tr>
    <th><a href="src/callbacks.js#files">callbacks</a></th>
    <td></td>
    <td>
      Provides <code>$.Callbacks</code> for use in "deferred" module.
    </td>
  </tr>
  <tr>
    <th><a href="src/selector.js#files">selector</a></th>
    <td></td>
    <td>
      Experimental <a href="http://api.jquery.com/category/selectors/jquery-selector-extensions/">jQuery
      CSS extensions</a> support for functionality such as <code>$('div:first')</code> and
      <code>el.is(':visible')</code>.
    </td>
  </tr>
  <tr>
    <th><a href="src/touch.js#files">touch</a></th>
    <td></td>
    <td>
      Fires tap– and swipe–related events on touch devices. This works with both
      `touch` (iOS, Android) and `pointer` events (Windows Phone).
    </td>
  </tr>
  <tr>
    <th><a href="src/gesture.js#files">gesture</a></th>
    <td></td>
    <td>Fires pinch gesture events on touch devices</td>
  </tr>
  <tr>
    <th><a href="src/stack.js#files">stack</a></th>
    <td></td>
    <td>Provides <code>andSelf</code> &amp; <code>end()</code> chaining methods</td>
  </tr>
  <tr>
    <th><a href="src/ios3.js#files">ios3</a></th>
    <td></td>
    <td>
      String.prototype.trim and Array.prototype.reduce methods
      (if they are missing) for compatibility with iOS 3.x.
    </td>
  </tr>
</tbody>
</table>

## Contributing

Please read our [contribution guidelines](https://github.com/madrobby/zepto/blob/master/CONTRIBUTING.md)
for information on how to contribute.

Get in touch:

* @[zeptojs](http://twitter.com/zeptojs)

### Write documentation

Zepto docs are written in Markdown and live in the ["gh-pages" branch][docs].
They are published on [zeptojs.com][].

You can use GitHub's web interface to make quick changes to documentation for
specific Zepto features
([example: ajaxSettings](https://github.com/madrobby/zepto/blob/gh-pages/ajax/_posts/1900-01-01-Z-ajaxSettings.md)).
This will submit a pull request to us that we can review.

### Report a bug

1. Check if the bug is already fixed in the [master branch][master] since the
   last release.
2. Check [existing issues][issues]. Open a new one, including exact browser &
   platform information. For better formatting of your report, see
   [GitHub-flavored Markdown][mkd].

### Running tests

You will need to install [PhantomJS][]. On OS X, that's easy:

~~~ sh
$ brew install phantomjs
~~~

To run the automated tests:

~~~ sh
$ npm test
~~~

To run a test server, which you can hit with your browsers and devices:

~~~ sh
$ npm start
~~~

Go to `http://your-ip-address:3000/` on your browser and follow the
instructions. For your convenience test failures and exceptions will be
reported to the the console you started the test server in (as well as
the browser console if available).

  [zeptojs.com]: http://zeptojs.com
  [master]: https://github.com/madrobby/zepto/commits/master
  [issues]: https://github.com/madrobby/zepto/issues
  [docs]: https://github.com/madrobby/zepto/tree/gh-pages#readme
  [mkd]: http://github.github.com/github-flavored-markdown/
  [evidence.js]: https://github.com/tobie/Evidence
  [phantomjs]: http://code.google.com/p/phantomjs/wiki/Installation
