util = {
  os: (->
    return {} unless navigator?

    if /Mac/.test navigator.appVersion
      mac: true
    else if /Linux/.test navigator.appVersion
      linux: true
    else if /Win/.test navigator.appVersion
      win: true
    else if /X11/.test navigator.appVersion
      unix: true
    else
      {}
  )()

  preloadImages: (images, callback) ->
    arguments.callee.loadedImages ||= {}
    loadedImages = arguments.callee.loadedImages

    if Object.prototype.toString.call(images) is "[object String]"
      images = [images]
    else if Object.prototype.toString.call(images) isnt "[object Array]"
      return false

    for url in images
      if !loadedImages[url] or callback
        imgObj = new Image()

        if callback and Object.prototype.toString.call(callback) is "[object Function]"
          imgObj.onload = ->
            loadedImages[url] = true
            callback(imgObj)

          imgObj.onerror = ->
            callback()

        imgObj.src = url
}

@simple = {} unless @simple

@simple[k] = v for k, v of util
