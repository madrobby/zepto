//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function ($) {

  // ### $.fn.serializeArray
  //
  // Encode a set of form elements as an array of names and values
  //
  // *Example:*
  //
  //     $('#login_form').serializeArray();
  //
  //  returns
  //
  //     [
  //         {
  //             name: 'email',
  //             value: 'koss@nocorp.me'
  //         },
  //         {
  //             name: 'password',
  //             value: '123456'
  //         }
  //     ]
  //
  $.fn.serializeArray = function () {
    var result = [];
    $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
      if ( $(this).attr('type') !== 'radio' || $(this).is(':checked') ) {
        result.push({
          name: $(this).attr('name'),
          value: $(this).val()
        });
      }
    });
    return result;
  };

  // ### $.fn.serialize
  //
  //
  // Encode a set of form elements as a string for submission
  //
  // *Example:*
  //
  //     $('#login_form').serialize();
  //
  //  returns
  //
  //     "email=koss%40nocorp.me&password=123456"
  //
  $.fn.serialize = function () {
    var result = [];
    this.serializeArray().forEach(function (elm) {
      result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) );
    });
    return result.join('&');
  };

  // ### $.fn.submit
  //
  // Trigger submit event for form or bind submit event
  //
  // *Examples:*
  //
  // To trigger submit event:
  //
  //     $('#login_form').submit();
  //
  // To bind submit event:
  //
  //     $('#login_form').submit(function (e) {
  //         alert('Form was submitted!');
  //         e.preventDefault();
  //     });
  //
  $.fn.submit = function (fn) {
    var isBind = typeof fn === 'function';
    return this.each(function () {
      if (isBind) {
        this.submit = fn;
      } else {
        try {
          this.submit();
          return;
        } catch(e) {};
      }
    });
  }

})(Zepto);
