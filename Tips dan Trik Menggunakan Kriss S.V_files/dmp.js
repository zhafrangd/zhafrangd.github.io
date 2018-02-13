(function() {
  var domain = 'https://rt.gsspat.jp';
  var vars = window._gnd || {};
  var params = {
    cid: 2707,
    loc: window.location,
    ref: document.referrer,
    dmp_v: 2,
    cvars: (function() {
      var v = '';
      for (key in vars) {
        v = v + '&' + key + '=' + vars[key];
      }
      return v.slice(1)
    })()
  };
  var isFpcEnabled = false;
  var isSynchronousRun = false;
  var cookieName = '___gid';
  var firstPartyGid = getFirstPartyGid();
  var now = new Date();
  var expires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  var cookie = cookieName + '=__GID__; expires=' + expires.toGMTString() + '; path=/';

  var beacon = domain + '/m?' + (function() {
    var v = '';
    for (key in params) {
      v = v + "&" + key + "=" + encodeURIComponent(params[key]);
    }
    v = v.slice(1);
    return isFpcEnabled ? v + '&fgid=__GID__' : v;
  })();

  var tag = '<script src="' + domain + '/n?v=1"></script><script>';
  tag += 'if(!window._genieeCookie) {document.write(\'<img src="//rt.gsspat.jp/yie/ld/cs?dspid=lamp" style="display: none;"/>\');} ';
  tag += 'var beacon = "' + beacon + '";';

  if (isFpcEnabled) {
    tag +=
      'var gid = window._genieeCookie || "' + firstPartyGid + '";' +
      'var cookie = "' + cookie + '";' +
      'document.cookie = cookie.replace("__GID__", gid);' +
      'beacon = beacon.replace("__GID__", gid);';
  }
  tag += 'var beacontag = \'<scr\' + \'ipt src="\'+ beacon + \'"></scr\' + \'ipt>\';' +
    'document.write(beacontag);' +
    '</script>';

  var ua = window.navigator.userAgent.toLowerCase();
  if (isSynchronousRun || !isAvailableFIF()) {
    document.write(tag);
    return;
  }

  var iframe = document.createElement('iframe');
  iframe.width = 0;
  iframe.height = 0;
  iframe.frameBorder = 0;
  iframe.src = 'javascript:document.open();document.close();';
  var current = document.getElementsByTagName('script')[0];
  current.parentNode.insertBefore(iframe, current);
  var child = iframe.contentWindow.document;
  child.open();
  child.write(tag);
  child.close();

  function isAvailableFIF() {
    return ua.indexOf('msie 7.') == -1 &&
      ua.indexOf('msie 8.') == -1 &&
      ua.indexOf('msie 9.') == -1;
  }

  function getFirstPartyGid() {
    if(!String.prototype.trim) { // for IE9
      String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g,'');
      };
    }
    var gid = '';
    var split = document.cookie.split(';');
    for(var i = 0, max = split.length; i < max; i++) {
      var nameValue = split[i].trim().split('=');
      if (nameValue[0] === cookieName) {
        gid = nameValue[1];
        break;
      }
    };
    return gid ? gid : createGid();
  }

  function createGid() {
    var set = 'abcdef0123456789';
    var setLength = set.length;
    var result = '';
    for (var i = 0; i < 32; i++) {
      result += set.charAt(Math.floor(Math.random() * setLength));
    }
    return result;
  }

})();
