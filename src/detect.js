//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  function detect(ua, width){
    var os = (this.os = {}), browser = (this.browser = {}), deviceType = (this.deviceType = {}),
      webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);

    if (webkit) browser.version = webkit[1];
    browser.webkit = !!webkit;

    if (android) os.android = true, os.version = android[2];
    if (iphone) os.ios = true, os.version = iphone[2].replace(/_/g, '.'), os.iphone = true;
    if (ipad) os.ios = true, os.version = ipad[2].replace(/_/g, '.'), os.ipad = true;
    if (webos) os.webos = true, os.version = webos[2];
    if (touchpad) os.touchpad = true;
    if (blackberry) os.blackberry = true, os.version = blackberry[2];

    deviceType.tablet = (width > 767);
    deviceType.mobile = !deviceType.tablet;
  }

  // ### $.os
  //
  // Object containing information about browser platform
  //
  // *Example:*
  //
  //     $.os.ios      // => true if running on Apple iOS
  //     $.os.android  // => true if running on Android
  //     $.os.webos    // => true if running on HP/Palm WebOS
  //     $.os.touchpad // => true if running on a HP TouchPad
  //     $.os.version  // => string with a version number, e.g.
  //                         "4.0", "3.1.1", "2.1", etc.
  //     $.os.iphone   // => true if running on iPhone
  //     $.os.ipad     // => true if running on iPad
  //     $.os.blackberry // => true if running on BlackBerry
  //
  // ### $.browser
  //
  // *Example:*
  //
  //     $.browser.webkit  // => true if the browser is WebKit-based
  //     $.browser.version // => WebKit version string
  //
  // ### $.deviceType
  //
  // *Example:*
  //
  //     $.deviceType.tablet // => true if running on a tablet
  //     $.deviceType.mobile // => true if running on a mobile phone
  detect.call($, navigator.userAgent, screen.width);

  // make available to unit tests
  $.__detect = detect;

})(Zepto);
