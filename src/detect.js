//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  function detect(ua){
    var ua = ua, os = {},
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
    if (android) os.android = true, os.version = android[2];
    if (iphone) os.ios = true, os.version = iphone[2].replace(/_/g, '.'), os.iphone = true;
    if (ipad) os.ios = true, os.version = ipad[2].replace(/_/g, '.'), os.ipad = true;
    if (webos) os.webos = true, os.version = webos[2];
    if (touchpad) os.touchpad = true;
    if (blackberry) os.blackberry = true, os.version = blackberry[2];
    return os;
  }

  // ### $.os
  //
  // Object contains information about running environmental
  //
  // *Example:*
  //
  //     $.os.ios      // => true if running on Apple iOS
  //     $.os.android  // => true if running on Android
  //     $.os.webos    // => true if running on HP/Palm WebOS
  //     $.os.touchpad // => true if running on a HP TouchPad
  //     $.os.version  // => string with version number,
  //                         "4.0", "3.1.1", "2.1", etc.
  //     $.os.iphone   // => true if running on iPhone
  //     $.os.ipad     // => true if running on iPad
  //     $.os.blackberry // => true if running on BlackBerry
  //
  $.os = detect(navigator.userAgent);
  $.__detect = detect;

  var v = navigator.userAgent.match(/WebKit\/([\d.]+)/);
  $.browser = v ? { webkit: true, version: v[1] } : { webkit: false };

})(Zepto);
