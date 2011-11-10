

# Zepto.js: a minimalist framework for mobile WebKit browsers

Zepto.js is a minimalist framework for mobile WebKit browsers,
with a jQuery-compatible chaining syntax.

100% jQuery coverage is not a design goal, however all APIs provided
match their jQuery counterparts.

The ultimate goal is to have a ~5k library that handles most basic dredge work
for you in a nice API so you can concentrate on getting stuff done.

Primary target platforms are:

* iOS 4+
* Android 2.2+
* webOS 1.4.5+

Secondary platforms (for plugin/extension development) are:

* Safari 5+ (desktop)
* Chrome 5+ (desktop)
* Other WebKit-based browsers/runtimes
* Mozilla Firefox 4+
* Opera 10+

In short, Zepto is expected to work in every modern browser except Internet Explorer.

# Syntax & features:

Basic call with CSS selector:

``` js
$('p>span').html('yoho').css('color:red');
```

Instead of a selector, a DOM Element, or a list of nodes can be passed in.

The $ function takes an optional context argument, which can be a DOM Element or a Zepto object:

``` js
$('span', $('p'))  // -> find all <span> elements in <p> elements

$('p').bind('click', function(){
  $('span', this).css('color:red'); // affects "span" children/grandchildren
});
```

Context and .find calls are equivalent:

``` js
$('span', $('p'))    // same
$('p').find('span')  // same
```

# Element functions:

``` js
get() // return array of all elements found
get(0) // return first element found
size() // the number of elements in collection
each(callback) // iterate over collection, calling callback for every element
index('selector') // the position of element matching 'selector' in the current collection
first() // new collection containing only the first matched element
last() // new collection containing only the last matched element
add() // merges collections of elements

find('selector') // find all children/grandchildren that match the given selector
closest('selector') // find the first matching element by going upwards starting from the current element
parents(['selector']) // get all ancestors of elements in collection, optionally filtered by a selector
parent() // immediate parent node of each element in collection
children('selector') // immediate children of each element in collection, optionally filtered by a selector
siblings('selector') // elements that share the same immediate parent (siblings) of each element in collection, optionally filtered by a selector
next() // next siblings
prev() // previous siblings
filter('selector') // reduce the current set of elements to match the given selector
is('selector') // returns true/false if first element matches the selector
not('selector') // remove elements matching 'selector' from the current collection
not(function(index){return true / false;}) // remove elements from current collection if the callback method returns `true`

remove() // remove element

html('new html') // set the contents of the element(s)
html(function(index, oldhtml){ return ...; }) // set the contents of the element(s) from a method

html() // get first element's .innerHTML
text() // get first element's .textContent
text('new text') // set the text contents of the element(s)
append(), prepend() // like html(), but add html (or a DOM Element or a Zepto object) to element contents
before(), after() // add html (or a DOM Element or a Zepto object) before/after the element
appendTo(), prependTo() // reverse appending/prepending
show() // forces elements to be displayed (only works correctly for block elements right now)
hide() // removes a elements from layout

offset() // get object with top: left: width: height: properties (in px)
height() // get first elements height in px
width() // get first elements width in px

attr('attribute') // get element attribute
attr('attribute', 'value') // set element attribute
attr('attribute', function(index, oldAttr){ return ...; }) // set the value of 'attribute' from a method, for each element in collection
removeAttr('attribute') // removes an attribute
data('name') // gets the value of the "data-name" attribute
data('name', 'value') // sets the value of the "data-name" attribute

css('css property', 'value') // set a CSS property
css({ property1: value1, property2: value2 }) // set multiple CSS properties
css('css property') // get this CSS property of the first element, looks at both .style object properties and the computed style

addClass('classname') // adds a CSS class name
addClass(function(index, existingClasses){ return ...; }) // adds a CSS class name from a method
removeClass('classname') // removes a CSS class name
removeClass(function(index, existingClasses){ return ...; }) // removes a CSS class name from a method
hasClass('classname') // returns true of first element has a classname set
toggleClass('classname'[, switch]) // adds/removes class, or adds/removes it when switch == true/false
toggleClass(function(index, existingClasses){ return ...; }) // adds/removes class from a method

bind(type, function) // add an event listener (see below)
one(type, function) // add an event listener that only fires once
unbind([type [, function]]) // remove event listeners
delegate(selector, type, function) // add an event listener w/ event delegation (see below)
undelegate(selector [, type[, function]]) // remove event listeners w/ event delegation
live(type, function) // add an event listener that listens to the selector for current and future elements
die([, type[, function]]) // remove live listener
trigger(type) // triggers an event

submit() // trigger form submit event
val() // returns the value of the form element
val('value') // sets the value of the form element
```

## CSS Animation

``` js
animate(transforms, duration, easing, callback)
animate(transforms, { duration: milliseconds, easing: '...', complete: callback })
// use -webkit-transform/opacity and do an animation,
// optionally supply a callback method to be executed after the animation is complete
```

## Non-jQuery functions

``` js
pluck(property)
// return property for each element
// e.g. pluck('innerHTML') returns an array of all innerHTML properties of all elements found
```

# Utility functions:

``` js
$(document).ready(function(){ ... }); // call function after DOM is ready to use (before load event fires)
$.isFunction(function), $.isObject(object), $.isArray(array); // returns true if given parameter is a function; an object; or an array, respectively
$.extend(target, secondObject) // extends (merge) the target object with secondObject. Modifies and returns target
```

# Event handlers

Adding an event listener:

``` js
$('some selector').bind('click', function(event){ ... });
```

Adding an event listener on multiple events:

``` js
$('some selector').bind('touchstart touchmove touchend', function(event){ ... });
```

Adding one event listener that uses event delegation to be only active on a range of children/grandchildren (as given with the subselector):

``` js
$('some selector').delegate('some subselector', 'touchstart', function(event){ alert("I'm touched!") });
```

Adding a "live" event listener, that fires on all elements that match the selector now and in the future:

``` js
$('p.yay').live('click', function(){ alert("Clicked a p.yay element!") });
```

Removing an event listener:

``` js
$('some selector').unbind('click', listener);
```

Removing all event listeners for a particular event:

``` js
$('some selector').unbind('click');
```

Removing all event listeners:

``` js
$('some selector').unbind();
```

# Touch events

Zepto has several extensions over the jQuery API to make it easy to react to touch events.
You need to include touch.js and/or gesture.js to use these.

Tapping:

``` js
$('some selector').tap(function(){ ... });
```

Double-tapping:

``` js
$('some selector').doubleTap(function(){ ... });
```

Swiping (e.g. "delete" button when swiping over a list entry):

``` js
$('some selector').swipe(function(){ ... });
```

Swiping left:

``` js
$('some selector').swipeLeft(function(){ ... });
```

Swiping right:

``` js
$('some selector').swipeRight(function(){ ... });
```

Swiping up:

``` js
$('some selector').swipeUp(function(){ ... });
```

Swiping down:

``` js
$('some selector').swipeDown(function(){ ... });
```

Pinch (iOS only):

``` js
$('some selector').pinch(function(){ ... });
```

Pinch in (iOS only):

``` js
$('some selector').pinchIn(function(){ ... });
```

Pinch out (iOS only):

``` js
$('some selector').pinchOut(function(){ ... });
```

# Ajax

Simple GET and POST:

``` js
$.get(url, callback)
$.post(url, [data], [callback], [mime-type])
$.getJSON(url, callback)
```

If the url contains `=?`, JSON-P mode is assumed.

If you need more control (all keys are optional):

``` js
$.ajax({
  type: 'POST', // defaults to 'GET'
  url: '/foo', // defaults to window.location
  data: {name: 'Zepto'}, // can be a string, object or result of serializeArray()
  dataType: 'json', // what response type you accept from the server ('json', 'xml', 'html', or 'text')
  success: function(body) { ... }, // body is a string (or if dataType is 'json', a parsed JSON object)
  error: function(xhr, type) { ... } // type is a string ('error' for HTTP errors, 'parsererror' for invalid JSON)
})
```

Loading content into an element:

``` js
$('selector').load('url'[, callback]);
$('selector').load('url #fragment-selector'[, callback]);
```

# Environmental information

Zepto includes information about the environment it is running in the $.os object:


``` js
$.os.ios      // => true if running on Apple iOS
$.os.android  // => true if running on Android
$.os.webos    // => true if running on HP/Palm WebOS
$.os.touchpad // => true if running on a HP TouchPad
$.os.version  // => string with version number, "4.0", "3.1.1", "2.1", etc.
$.os.iphone   // => true if running on iPhone
$.os.ipad     // => true if running on iPad
$.os.blackberry // => true if running on BlackBerry
```

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

# Loading Zepto

You load Zepto by using

``` html
<script src="/path/to/zepto.min.js"></script>
```

Or alternatively, you can just stick in the contents of zepto.min.js into a `<script>` tag
in your HTML for the best loading performance, especially for single-page applications;
no need to load it from an external file!

# Bugs

If you encounter bugs, please follow these steps:

1. First, try if the bug is fixed in the latest Zepto.js master branch:
   Get it from http://github.com/madrobby/zepto.

2. Submit the bug on our issue tracker:
   http://github.com/madrobby/zepto/issues

Let us know in detail what is going on, including the exact browser version you're on
and preferably a test case that can be reached online so we can quickly reproduce the
error.

Better, yet, fix the bug and bask in the glory of being a contributor (see below!).

# Contributing!

I'd love some help on this, so please feel free to mess around!

If you don't know how a method should behave, please use jQuery as a reference. Zepto.js should closely emulate it.
Note that emulation of all features of jQuery is not a project goal, rather we want the most useful parts while keeping
to the ~5k minified goal.

Checklist for submitting patches:

* If it's an "esoteric" feature, please discuss first!
* Small bug fixes can go in right away.
* Always, always, always update the tests. All tests must pass.
* Write concise code.
* Don't add more than one feature or bug fix per pull request.
* Run `rake whitespace` to clean up whitespace in code & tests
* Use Github's pull request system to submit patches

If you submit patches, please include tests.

Also, Zepto.js contains some non-jQuery extensions, that are geared towards mobile devices.

Visit http://zeptojs.com/

Join Zepto.js Convore group https://convore.com/zeptojs/, #zepto on irc.freenode.net and stay updated on http://twitter.com/zeptojs

Have fun!

# License

Zepto.js is is licensed under the terms of the MIT License, see the included MIT-LICENSE file.
