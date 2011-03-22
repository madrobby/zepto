//fix for iOS 3.2
if (!String.prototype.trim)
  String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') };

//fix for iOS 3.x
//from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
if (!Array.prototype.reduce)
  Array.prototype.reduce = function(fun){
    if(this === void 0 || this === null) throw new TypeError();
    var t = Object(this), len = t.length >>> 0, k = 0, accumulator, undefined;
    if(typeof fun !== 'function') throw new TypeError();
    if(len === 0 && arguments.length === 1) throw new TypeError();

    if(arguments.length >= 2)
     accumulator = arguments[1];
    else
      do{
        if(k in t){
          accumulator = t[k++];
          break;
        }
        if(++k >= len) throw new TypeError();
      } while (true);

    while (k < len){
      if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t);
      k++;
    }
    return accumulator;
  };
