(function() {
    var shimName = "IE9 Zepto shim: ";
    var $ = window.Zepto;
    if (!$) throw shimName + "Error: can't find window.Zepto";

    if (document.documentMode < 9) throw shimName + "Error: browser is not IE9+ or is running in compatibility mode";

    var emptyArray = [];

    $.Z = function(dom, selector) {
        dom = dom || [];
        var result = new makeZ(dom);
        result.selector = selector || '';
        return result;
    };

    var makeZ = function Z(dom) {
        emptyArray.push.apply(this, dom);
        return this;
    };
    $.Z.prototype = makeZ.prototype = $.fn;

    $.inArray = function(elem, array, i) {
        return emptyArray.indexOf.call(array, elem, i);
    }

    $.fn.concat = function() {
        var result = [];
        result.push.apply(result, this);
        $.each(arguments, function(i, el) {
            if (typeof el.length == 'number') {
                result.push.apply(result, el)
            } else {
                result.push(el);
            }
        });
        return result;
    };

    $.fn.empty = function() {
        return this.each(function(i, node){
            while ( node.firstChild ) {
                node.removeChild(node.firstChild);
            }
        });
    };

    var fragmentRE = /^\s*<(\w+)[^>]*>/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        wrapMap = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            area: [ 1, "<map>", "</map>" ],
            "*": [ 0, "", "" ]
        };

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;    

    $.fragment = function(html, name) {
        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
        html = html.toString().replace(rxhtmlTag, "<$1></$2>");

        var wrap = wrapMap[name] || wrapMap['*'],
            depth = wrap[0],
            div = document.createElement("div");

        div.innerHTML = wrap[1] + html + wrap[2];
    
        // Move to the right depth
        while ( depth-- ) {
            div = div.lastChild;
        }        

        return emptyArray.slice.call(div.childNodes);
    }
})();