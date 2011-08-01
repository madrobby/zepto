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
    var result = [], el;
    $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
      el = $(this);
      if ( (el.attr('type') !== 'radio' || el.is(':checked')) && !(el.attr('type') === 'checkbox' && !el.is(':checked'))) {
        result.push({
          name: el.attr('name'),
          value: el.val()
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
  // Bind or trigger the submit event for a form
  //
  // *Examples:*
  //
  // To bind a handler for the submit event:
  //
  //     $('#login_form').submit(function (e) {
  //         alert('Form was submitted!');
  //         e.preventDefault();
  //     });
  //
  // To trigger form submit:
  //
  //     $('#login_form').submit();
  //
  $.fn.submit = function (callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit');
      this.eq(0).trigger(event);
      if (!event.defaultPrevented) this.get(0).submit()
    }
    return this;
  }

})(Zepto);
