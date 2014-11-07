(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('simple-util', ["jquery"], function ($) {
      return (root.returnExportsGlobal = factory($));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    root.simple = root.simple || {};
    root.simple['util'] = factory(jQuery);
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
    var chrome, firefox, ie, safari, ua;
    ua = navigator.userAgent;
    ie = /(msie|trident)/i.test(ua);
    chrome = /chrome|crios/i.test(ua);
    safari = /safari/i.test(ua) && !chrome;
    firefox = /firefox/i.test(ua);
    if (ie) {
      return {
        msie: true,
        version: ua.match(/(msie |rv:)(\d+(\.\d+)?)/i)[2]
      };
    } else if (chrome) {
      return {
        webkit: true,
        chrome: true,
        version: ua.match(/(?:chrome|crios)\/(\d+(\.\d+)?)/i)[1]
      };
    } else if (safari) {
      return {
        webkit: true,
        safari: true,
        version: ua.match(/version\/(\d+(\.\d+)?)/i)[1]
      };
    } else if (firefox) {
      return {
        mozilla: true,
        firefox: true,
        version: ua.match(/firefox\/(\d+(\.\d+)?)/i)[1]
      };
    } else {
      return {};
    }
  })(),
  preloadImages: function(images, callback) {
    var imgObj, loadedImages, url, _base, _i, _len, _results;
    (_base = arguments.callee).loadedImages || (_base.loadedImages = {});
    loadedImages = arguments.callee.loadedImages;
    if (Object.prototype.toString.call(images) === "[object String]") {
      images = [images];
    } else if (Object.prototype.toString.call(images) !== "[object Array]") {
      return false;
    }
    _results = [];
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      url = images[_i];
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
        _results.push(imgObj.src = url);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
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
  readableDate: function(date, opts) {
    var defaultOpts, key, today, tomorrow, val, yesterday;
    if (!((typeof moment !== "undefined" && moment !== null) && typeof moment === 'function')) {
      return '';
    }
    if (!date.isValid()) {
      return '';
    }
    defaultOpts = {
      defaultFormat: false,
      currentWeek: false,
      nextWeek: false
    };
    for (key in opts) {
      val = opts[key];
      defaultOpts[key] = val;
    }
    opts = defaultOpts;
    date = date.clone().startOf('day');
    if (date._z) {
      today = moment.tz(date._z.name).startOf('d');
    } else {
      today = moment().startOf('d');
    }
    tomorrow = today.clone().add(1, 'd');
    yesterday = today.clone().add(-1, 'd');
    if (date.isSame(today)) {
      return "今天";
    }
    if (date.isSame(tomorrow)) {
      return "明天";
    }
    if (date.isSame(yesterday)) {
      return "昨天";
    }
    if (opts.currentWeek && date.isSame(today, 'isoweek')) {
      return "本周" + (moment.weekdaysMin()[date.isoWeekday() % 7]);
    }
    if (opts.nextWeek && date.isSame(today.add(1, 'week'), 'isoweek')) {
      return "下周" + (moment.weekdaysMin()[date.isoWeekday() % 7]);
    }
    if (opts.defaultFormat) {
      return date.format(opts.defaultFormat);
    }
    if (!date.isSame(today, 'year')) {
      return date.format('YY年M月D日');
    }
    return date.format('M月D日');
  },
  readableTime: function(datetime) {
    var delta, now, yesterday;
    if (!((typeof moment !== "undefined" && moment !== null) && typeof moment === 'function')) {
      return '';
    }
    if (!datetime.isValid()) {
      return '';
    }
    if (datetime._z) {
      now = moment.tz(datetime._z.name);
    } else {
      now = moment();
    }
    yesterday = now.clone().startOf('day').add(-1, 'd');
    delta = now.diff(datetime);
    if (now.diff(datetime, 'minutes') < 1) {
      return '刚刚';
    }
    if (yesterday.isSame(datetime.clone().startOf('day'))) {
      return "昨天";
    }
    if (now.diff(datetime, 'hours') < 1) {
      return "" + (now.diff(datetime, 'minutes')) + "分钟前";
    }
    if (now.diff(datetime, 'days') < 1) {
      return "" + (now.diff(datetime, 'hours')) + "小时前";
    }
    if (now.diff(datetime, 'years') < 1) {
      return datetime.format('M月D日');
    }
    return datetime.format('YY年M月D日');
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


