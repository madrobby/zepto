(function($){
  function detect(ua){
    var ua = ua, os = {},
      android = ua.match(/(Android)\s+([0-9\.]+)/),
      iphone = ua.match(/(iPhone\sOS)\s([0-9_]+)/),
      ipad = ua.match(/(iPad).*OS\s([0-9_]+)/),
      webos = ua.match(/(webOS)\/([0-9\.]+)/);
    if(android) os.android = true, os.version = android[2];
    if(iphone) os.ios = true, os.version = iphone[2].replace(/_/g,'.'), os.iphone = true;
    if(ipad) os.ios = true, os.version = ipad[2].replace(/_/g,'.'), os.ipad = true;
    if(webos) os.webos = true, os.version = webos[2];
    return os;
  }
  $.os = detect(navigator.userAgent);
  $.__detect = detect;
})(Zepto);