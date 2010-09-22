# zepto.js #

zepto.js is a minimalist inlinable framework for mobile WebKit browsers, with a jQuery-like chaining syntax.

The ultimate goal is to have a ~2k library that handles most basic dredge work for you in a nice API so you can concentrate on getting stuff done. 


## Targets ##

### Primary target platforms ###

 - iOS 4+
 - Android 2.2+ 
 - webOS 1.4.5+

### Secondary platforms ###

 - Safari 5+ (desktop)
 - Chrome 5+ (desktop)


## Syntax & features ##

### Basic call ###
   
    $('some css selector').html('set contents').css('set styles');


### Element functions ###
  
  `each(fn)` : Execute a function for each matched element.
  `get()` : Return array of all elements found.
  `get(0)` : Return first element found.
  `eq(1)` : Reduce matched elements to a single element by index.
  `find('selector')` : Match descendant element(s) based on selector.
  `html('new html')` : Set the contents of the element(s).
  `css('css properties')` : Set styles of the element(s).
  `append`, `prepend`, `after`, `before` : Like `html`, but append/prepend to element contents or before/after element.
  `anim(transform, opacity, duration)` : Use -webkit-transform/opacity and do an animation.
  `delegate(selector, eventType, handler)` : Attach an Event listener to matched elements using the event delegation pattern.


### Helpers ###
  
  `unique(array)` : Return a new array that contain only unique items.
  `makeArray(obj)` : Convert an array-like Object into an real array.
  `extend(firstObj, secondObj)` : Mixin, copy properties from one object into another, will extend `zepto` by default if second parameter is omitted.


### Event Handlers ("live" events) ###

#### delegate ####

    $('body').delegate('div.touchable', 'touchstart', function(evt){
    	alert("I'm touched!");
    });


### Ajax: ###

  `$.ajax(method, url, succesCallback, errorCallback)`
  `$.get(url, succesCallback, errorCallback)`
  `$.post(url, succesCallback, errorCallback)`
  `$.getJSON(url, succesCallback, errorCallback)`


## Notes ##

### Future improvements ###

 - Add sniffing based on feature detection, maybe only load *zepto.min.js* if browser support required features.
 - Split source code into multiple files and group based on function use (e.g. DOM, XHR, helpers, etc).
 - Maybe create different builds that removes specific modules (maybe using a preprocessor + require.js).
 - Add JSLint to build process.

### Recommendations ###

Best used if you stick in the contents of zepto.min.js into a `<script>` tag in your HTML (no need to load it form an external file).

I'd love some help on this, so please feel free to mess around!

Have fun!