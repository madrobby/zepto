;(function($){
    // Values for shifted keys
    var shiftNums = {
		"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
		"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
		".": ">",  "/": "?",  "\\": "|"
	};
    var specialKeys = {
		8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
		20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
		37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
		96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
		104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
		112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
		120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 186: ";", 191: "/",
		220: "\\", 222: "'", 224: "meta"
	};

    $.fn.shortcut = function(shct, fn){
        // Split keys using the +
        var spe = shct.toLowerCase().split('+'),
            key = '';

        // Seperate normal key from the special keys
        for (var i = 0; i < spe.length; i++){
            if (spe[i].length != 1) continue;
            key = spe[i];
            spe.splice(i, 1);
        }

        // Sort the special keys
        spe.sort();

        // Now reassign shct with the sorted keys
        shct = ((spe.length > 0) ? spe.join('+') + '+' : '') + key;

        this.on('keydown.shortcut.' + shct, function(e){
            // If the event is for a special key then ditch
            if (specialKeys[e.which] != undefined) return;

            // Get the character pressed
			var character = String.fromCharCode( e.which ).toLowerCase(),
				modif = '', possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if (e.altKey){
				modif += 'alt+';
			}
			if (e.ctrlKey){
				modif += 'ctrl+';
			}
			if (e.metaKey && !e.ctrlKey){
				modif += 'meta+';
			}
			if (e.shiftKey){
				modif += 'shift+';
			}

			possible[ modif + character ] = true;
			possible[ modif + shiftNums[ character ] ] = true;

			// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
			if (modif === 'shift+') {
				possible[ shiftNums[ character ] ] = true;
			}

            // If we have a match for our shortcut then fire the callback
            if (possible[shct]){
                fn.apply(this, arguments);
            }
        })
    }

})(Zepto)
