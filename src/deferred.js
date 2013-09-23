//     Zepto.js
//     (c) 2010-2013 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  $.Deferred = function(func) {
    var tuples = [
          // action, add listener, listener list, final state
          [ "resolve", "done", $.Callbacks({once:1, memory:1}), "resolved" ],
          [ "reject", "fail", $.Callbacks({once:1, memory:1}), "rejected" ],
          [ "notify", "progress", $.Callbacks({memory:1}) ]
        ],
        state = "pending",
        promise = {
          state: function() {
            return state
          },
          always: function() {
            deferred.done(arguments).fail(arguments)
            return this
          },
          then: function(/* fnDone [, fnFailed [, fnProgress]] */) {
            var fns = arguments
            return $.Deferred(function(defer) {
              $.each(tuples, function(i, tuple) {
                var fn = $.isFunction(fns[i]) && fns[i]
                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                deferred[tuple[1]](function() {
                  var returned = fn && fn.apply(this, arguments)
                  if (returned && $.isFunction(returned.promise)) {
                    returned.promise()
                      .done(defer.resolve)
                      .fail(defer.reject)
                      .progress(defer.notify)
                  } else {
                    defer[tuple[0] + "With"](this === promise ? defer.promise() : this, fn ? [returned] : arguments)
                  }
                })
              })
              fns = null
            }).promise()
          },
          
          promise: function(obj) {
            return obj != null ? $.extend( obj, promise ) : promise
          }
        },
        deferred = {}

    // Backwards compatibility alias -- Omit?
    promise.pipe = promise.then

    // List-specific methods
    $.each(tuples, function(i, tuple) {
      var list = tuple[2],
          stateString = tuple[3]

      // promise[ done | fail | progress ] = list.add
      promise[tuple[1]] = list.add

      // Handle state
      if (stateString) {
        list.add(function() {
          // state = [ resolved | rejected ]
          state = stateString

          // [ reject_list | resolve_list ].disable progress_list.lock
        }, tuples[i^1][2].disable, tuples[2][2].lock)
      }

      // deferred[ resolve | reject | notify ]
      deferred[tuple[0]] = function() {
        deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
        return this
      }
      deferred[tuple[0] + "With"] = list.fireWith
    })
    
    // Make the deferred a promise
    promise.promise(deferred)

    // Call given func if any
    if (func) {
      func.call(deferred, deferred)
    }

    // Return created object
    return deferred
  }
})(Zepto)