//     Zepto.js
//     (c) 2010-2013 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  // Simplified implementation of jQuery's $.Callbacks helper, relied upon by $.ajax and
  // $.Deferred.
  //
  // Unlike jQuery, this implementation supports passing of parameters only as objects,
  // which may be slightly inconvenient, but also should performs slightly better than
  // jQuery's implementation involving string manipulation.
  //
  // Option flags:
  //   - once
  //   - memory
  //   - stopOnFalse
  //   - unique
  $.Callbacks = function(options) {
    if (options && typeof options !== 'object') {
      return;
    }
    options = $.extend({}, options)

    var memory, // Last fire value (for non-forgettable lists)
        fired,  // Flag to know if list was already fired
        firing, // Flag to know if list is currently firing
        firingStart, // First callback to fire (used internally by add and fireWith)
        firingLength, // End of the loop when firing
        firingIndex, // Index of currently firing callback (modified by remove if needed)
        list = [], // Actual callback list
        stack = !options.once && [], // Stack of fire calls for repeatable lists
        fire = function(data) {
          memory = options.memory && data
          fired = true
          firingIndex = firingStart || 0
          firingStart = 0
          firingLength = list.length
          firing = true
          for ( ; list && firingIndex < firingLength ; ++firingIndex ) {
            if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
              memory = false // To prevent further calls using add
              break
            }
          }
          firing = false
          if (list) {
            if (stack) {
              if (stack.length) {
                fire(stack.shift())
              }
            } else if (memory) {
              list.length = 0
            } else {
              Callbacks.disable()
            }
          }
        },
        
        // Callbacks list object
        Callbacks = {
          // Add a callback or a collection of callbacks to the list
          add: function() {
            if (list) {
              // First, we save the current length
              var start = list.length
              function _add(args) {
                $.each(args, function(_, arg) {
                  if (typeof arg === "function") {
                    if (!options.unique || !Callbacks.has(arg)) {
                      list.push(arg)
                    }
                  } else if (arg && arg.length && typeof arg !== "string") { // $.isArray?
                    _add(arg)
                  }
                })
              }
              _add(arguments)
              // Do we need to add the callbacks to the
              // current firing batch?
              if (firing) {
                firingLength = list.length
              // With memory, if we're not firing then
              // we should call right away
              } else if (memory) {
                firingStart = start
                fire(memory)
              }
            }
            return this
          },
          // Remove a callback from the list
          remove: function() {
            if (list) {
              $.each(arguments, function(_, arg) {
                var index
                while ((index = $.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1)
                  // Handle firing indexes
                  if (firing) {
                    if (index <= firingLength) {
                      --firingLength
                    }
                    if (index <= firingIndex) {
                      --firingIndex
                    }
                  }
                }
              })
            }
            return this
          },
          // Check if a given callback is in the list.
          // If no argument is given, return whether or not list has callbacks attached.
          has: function(fn) {
            return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
          },
          // Remove all callbacks from the list
          empty: function() {
            firingLength = list.length = 0
            return this
          },
          // Have the list do nothing anymore
          disable: function() {
            list = stack = memory = undefined
            return this
          },
          // Is it disabled?
          disabled: function() {
            return !list
          },
          // Lock the list in its current state
          lock: function() {
            stack = undefined;
            if (!memory) {
              Callbacks.disable()
            }
            return this
          },
          // Is it locked?
          locked: function() {
            return !stack
          },
          // Call all callbacks with the given context and arguments
          fireWith: function(context, args) {
            if (list && (!fired || stack)) {
              args = args || []
              args = [context, args.slice ? args.slice() : args]
              if (firing) {
                stack.push(args)
              } else {
                fire(args)
              }
            }
            return this
          },
          // Call all the callbacks with the given arguments
          fire: function() {
            return Callbacks.fireWith(this, arguments)
          },
          // To know if the callbacks have already been called at least once
          fired: function() {
            return !!fired
          }
        }
    return Callbacks
  }
})(Zepto)