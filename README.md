# Zepto.js -- a minimalist JavaScript framework

Zepto is a minimalist JavaScript framework for modern browsers with a
largely jQuery-compatible API. If you use jQuery, you already know how to use Zepto.

# Documentation

Please see http://zeptojs.com/ for documentation, features and an introduction.

To contribute documentation, please check out the `gh-pages` branch of this repository.

# Building

Zepto.js can be used as-is. However, for best efficiency, run the included build step that uses UglifyJS to minify Zepto.js and will give you an estimate on the compression that is achievable when Zepto.js is served Gzipped.

For this to work, you need Ruby and Rake installed.

First of all, check you have the uglifier gem installed typing

``` sh
$ gem install uglifier
```

Then build the minified file with

``` sh
$ rake
```

You'll see an output like:

```
Original version: 22.034k
Minified: 11.826k
Minified and gzipped: 4.485k, compression factor 4.912
```

The minified file is saved in "dist/zepto.min.js".

You can do custom build of Zepto by calling `concat` with alist of
colon-seperated module names to include or leave out (prepend with `-`):

```
$ rake concat\[-touch:-fx:data\] dist
(in /Users/thomas/Projects/zepto)
Building zepto.js by including: polyfill, zepto, event, detect, ajax, form, data
Minifying /Users/thomas/Projects/zepto/dist/zepto.js with UglifyJS...
cp /Users/thomas/Projects/zepto/dist/zepto.min.js /Users/thomas/Projects/zepto/dist/temp.js
rm -rf /Users/thomas/Projects/zepto/dist/temp.js.gz
Original version: 40.423k
Minified: 18.776k
Minified and gzipped: 7.033k, compression factor 5.747
```

By default, Zepto includes `polyfill`, `zepto`, `event`, `detect`, `fx`, `ajax`, `form`, and
`touch`.

The `data`, `fx_methods`, `assets`, `gesture`, and `stack` modules are optional.

# Bugs

If you encounter bugs, please follow these steps:

1. First, try if the bug is fixed in the latest Zepto.js master branch:
   Get it from http://github.com/madrobby/zepto.

2. If you don't know it yet, read http://github.github.com/github-flavored-markdown/

3. Submit the bug on our issue tracker:
   http://github.com/madrobby/zepto/issues

Let us know in detail what is going on, including the exact browser version you're on
and preferably a test case that can be reached online so we can quickly reproduce the
error.

Better, yet, fix the bug and bask in the glory of being a contributor (see below!).

# Contributing!

We love help on this, so please feel free to mess around!

If you don't know how a method should behave, please use jQuery as a reference. Zepto.js should closely emulate it.
Note that emulation of all features of jQuery is not a project goal, rather we want the most useful parts while keeping
to the ~5-10k minified goal.

Checklist for submitting patches:

* If it's an "esoteric" feature, please discuss first!
* Small bug fixes can go in right away.
* Always, always, always update the tests. All tests must pass.
* Write concise code.
* Please adhere to the Zepto code style guide (see below)
* Don't add more than one feature or bug fix per pull request.
* Run `rake whitespace` to clean up whitespace in code & tests
* Use Github's pull request system to submit patches

# Running tests

If you submit patches, please include tests.

Zepto tests are written using Evidence.js and can be found
in the `test` folder. See https://github.com/tobie/Evidence for more info on Evidence.

Simply add your tests (see existing tests as templates) and then view the HTML file in a browser).
For detailed results, see the JavaScript console in your browser.

IRC channel: #zepto on irc.freenode.net — stay updated on http://twitter.com/zeptojs

Remember to have fun!

# Code style guide

These are the style guidelines:

* Use `function name() { }` for named functions
* Use `function(){ }` for anonymous functions
* Don't use curly braces for single-line statements with `if` and friends
* Don't use semicolons at the end of statements, if the semicolon would be at the end of the line
* Use a single semicolon before statements that start with `(` or `[`
* Use full word-length descriptive variable names
* Use whitespace to indicate blocks of code and make code more readable
* Use comments to describe unexpected code behavior

For the semicolon-less rules, please refer to http://mislav.uniqpath.com/2010/05/semicolons/ for why
we're doing this.

# License

Zepto.js is is licensed under the terms of the MIT License, see the included MIT-LICENSE file.
