// IE Support
// This module provides a very basic IE Support fix by adding the __proto__ property to objects.
;(function(undefined){
    if (!('__proto__' in {})) {
        Object.defineProperty(Object.prototype, '__proto__', {
            set: function (x) {
                for (var prop in x) {
                    if (prop == '__proto__') continue;
                    this[prop] = x[prop];
                }
            },
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
    }
})()
