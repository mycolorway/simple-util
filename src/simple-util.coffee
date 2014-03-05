preloadedImages = {}

util = {
  preloadImages: (images, callback) ->
    if Object.prototype.toString.call(images) is "[object String]"
      images = [images]
    else if Object.prototype.toString.call(images) isnt "[object Array]"
      return false

    for img in images
      unless preloadedImages[img]
        imgObj = new Image()

        if callback and Object.prototype.toString.call(callback) is "[object Function]"
          imgObj.onload = ->
            preloadedImages[img] = true
            callback(imgObj)

          imgObj.onerror = ->
            callback()

        imgObj.src = img
}

@simple = {} unless @simple

@simple[k] = v for k, v of util
