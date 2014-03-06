(function() {
  var k, util, v;

  util = {
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
        if (!loadedImages[url]) {
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
    }
  };

  if (!this.simple) {
    this.simple = {};
  }

  for (k in util) {
    v = util[k];
    this.simple[k] = v;
  }

}).call(this);
