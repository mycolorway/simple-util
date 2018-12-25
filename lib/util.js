(function (root, factory) {
  if (root === undefined && window !== undefined) root = window;
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-util', ["jquery"], function (a0) {
      return (root['util'] = factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    root.simple = root.simple || {};
    root.simple['util'] = factory(root["jQuery"]);
  }
}(this, function ($) {

var util;

util = {
  os: (function() {
    if (typeof navigator === "undefined" || navigator === null) {
      return {};
    }
    if (/Mac/.test(navigator.appVersion)) {
      return {
        mac: true
      };
    } else if (/Linux/.test(navigator.appVersion)) {
      return {
        linux: true
      };
    } else if (/Win/.test(navigator.appVersion)) {
      return {
        win: true
      };
    } else if (/X11/.test(navigator.appVersion)) {
      return {
        unix: true
      };
    } else {
      return {};
    }
  })(),
  browser: (function() {
    var chrome, firefox, ie, ref, ref1, ref2, ref3, safari, ua;
    ua = navigator.userAgent;
    ie = /(msie|trident)/i.test(ua);
    chrome = /chrome|crios/i.test(ua);
    safari = /safari/i.test(ua) && !chrome;
    firefox = /firefox/i.test(ua);
    if (ie) {
      return {
        msie: true,
        version: (ref = ua.match(/(msie |rv:)(\d+(\.\d+)?)/i)) != null ? ref[2] : void 0
      };
    } else if (chrome) {
      return {
        webkit: true,
        chrome: true,
        version: (ref1 = ua.match(/(?:chrome|crios)\/(\d+(\.\d+)?)/i)) != null ? ref1[1] : void 0
      };
    } else if (safari) {
      return {
        webkit: true,
        safari: true,
        version: (ref2 = ua.match(/version\/(\d+(\.\d+)?)/i)) != null ? ref2[1] : void 0
      };
    } else if (firefox) {
      return {
        mozilla: true,
        firefox: true,
        version: (ref3 = ua.match(/firefox\/(\d+(\.\d+)?)/i)) != null ? ref3[1] : void 0
      };
    } else {
      return {};
    }
  })(),
  preloadImages: function(images, callback) {
    var base, i, imgObj, len, loadedImages, results, url;
    (base = arguments.callee).loadedImages || (base.loadedImages = {});
    loadedImages = arguments.callee.loadedImages;
    if (Object.prototype.toString.call(images) === "[object String]") {
      images = [images];
    } else if (Object.prototype.toString.call(images) !== "[object Array]") {
      return false;
    }
    results = [];
    for (i = 0, len = images.length; i < len; i++) {
      url = images[i];
      if (!loadedImages[url] || callback) {
        imgObj = new Image();
        if (callback && Object.prototype.toString.call(callback) === "[object Function]") {
          imgObj.onload = function() {
            loadedImages[url] = true;
            return callback(imgObj);
          };
          imgObj.onerror = function() {
            return callback();
          };
        }
        results.push(imgObj.src = url);
      } else {
        results.push(void 0);
      }
    }
    return results;
  },
  transitionEnd: function() {
    var el, t, transitions;
    el = document.createElement('fakeelement');
    transitions = {
      'transition': 'transitionend',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };
    for (t in transitions) {
      if (el.style[t] !== void 0) {
        return transitions[t];
      }
    }
  },
  storage: {
    supported: function() {
      var e;
      try {
        localStorage.setItem('_storageSupported', 'yes');
        localStorage.removeItem('_storageSupported');
        return true;
      } catch (_error) {
        e = _error;
        return false;
      }
    },
    set: function(key, val, session) {
      var storage;
      if (session == null) {
        session = false;
      }
      if (!this.supported()) {
        return;
      }
      storage = session ? sessionStorage : localStorage;
      return storage.setItem(key, val);
    },
    get: function(key, session) {
      var storage;
      if (session == null) {
        session = false;
      }
      if (!this.supported()) {
        return;
      }
      storage = session ? sessionStorage : localStorage;
      return storage[key];
    },
    remove: function(key, session) {
      var storage;
      if (session == null) {
        session = false;
      }
      if (!this.supported()) {
        return;
      }
      storage = session ? sessionStorage : localStorage;
      return storage.removeItem(key);
    }
  }
};

return util;

}));