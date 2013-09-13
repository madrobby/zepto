// IE Support
// This module provides a IE Support to all __proto__ dependant libraries by adding the __proto__ property to objects.
;(function(undefined){
    if (!('__proto__' in {})) {
        Object.defineProperty(Object.prototype, '__proto__', {
            set: function (x) {
                for (var prop in x) {
                    // Stops stack overflow errors
                    if (prop == '__proto__') continue;
                    this[prop] = x[prop];
                }
            },
            get: function () {
                return this;
            },
            enumerable: false,
            configurable: true
        });
    }
})()
