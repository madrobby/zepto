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
  
 - `.each(fn)` : Execute a function for each matched element.
 - `.get()` : Return array of all elements found.
 - `.get(0)` : Return first element found.
 - `.eq(1)` : Reduce matched elements to a single element by index.
 - `.find('selector')` : Match descendant element(s) based on selector.
 - `.html('new html')` : Set the contents of the element(s).
 - `.css('css properties')` : Set styles of the element(s).
 - `.append`, `prepend`, `after`, `before` : Like `html`, but append/prepend to element contents or before/after element.
 - `.anim(transform, opacity, duration)` : Use -webkit-transform/opacity and do an animation.
 - `.delegate(selector, eventType, handler)` : Attach an Event listener to matched elements using the event delegation pattern.
 - `.hasClass(className)` : Check if any matched element has given class.
 - `.addClass(className)` : Add one or more classes (separated by spaces) into each matched element.
 - `.removeClass(className)` : Removes one or more class names (separated by spaces) from mathched elements, removes all classes if `null`.
 - `.toggleClass(className, switch)` : Add or remove one or more classes from each element in the set of matched elements.
 - `.add(elementsArray)` : Add a set of elements to the matched elements set.
 - `.map(callbackFn(i, element))` : Pass each element in the current matched set through a function, producing a new zepto object containing the return values.

### Helpers ###
  
 - `$.isDef (param)` : Check if parameter is different than `undefined`.
 - `$.unique(array)` : Return a new array that contain only unique items.
 - `$.makeArray(obj)` : Convert an array-like Object into an real array.
 - `$.extend(firstObj, secondObj)` : Mixin, copy properties from one object into another, will extend `zepto` by default if second parameter is omitted.
 - `$.map(array, callbackFn)` : Translate all items in an array or array-like object to another array of items. (similar to similar to `jQuery.map` and not to `Array.prototype.map`)

### Event Handlers ("live" events) ###

#### delegate ####

    $('body').delegate('div.touchable', 'touchstart', function(evt){
    	alert("I'm touched!");
    });


### Ajax: ###

 - `$.ajax(method, url, succesCallback, errorCallback)`
 - `$.get(url, succesCallback, errorCallback)`
 - `$.post(url, succesCallback, errorCallback)`
 - `$.getJSON(url, succesCallback, errorCallback)`


## Notes ##

### Future improvements ###

 - Add sniffing based on feature detection, maybe only load *zepto.min.js* and subsequent files if browser support required features.
 - Maybe create different builds that removes specific modules.
 - Add JSLint to build process.

### Recommendations ###

Best used if you stick in the contents of zepto.min.js into a `<script>` tag in your HTML (no need to load it form an external file).

I'd love some help on this, so please feel free to mess around!

Have fun!