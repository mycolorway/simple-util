(function() {
  var k, preloadedImages, util, v;

  preloadedImages = {};

  util = {
    preloadImages: function(images, callback) {
      var img, imgObj, _i, _len, _results;
      if (Object.prototype.toString.call(images) === "[object String]") {
        images = [images];
      } else if (Object.prototype.toString.call(images) !== "[object Array]") {
        return false;
      }
      _results = [];
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        img = images[_i];
        if (!preloadedImages[img]) {
          imgObj = new Image();
          if (callback && Object.prototype.toString.call(callback) === "[object Function]") {
            imgObj.onload = function() {
              preloadedImages[img] = true;
              return callback(imgObj);
            };
            imgObj.onerror = function() {
              return callback();
            };
          }
          _results.push(imgObj.src = img);
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
